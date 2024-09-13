from langchain_core.prompts import PromptTemplate
import re
from langchain_ollama import ChatOllama

# List of field names in the order they appear except the last Decision field
fields = [
    "Meeting_date",
    "Attendees",
    "Project_name",
    "Project_id",
    "Project_proposed_revised_cost",
    "Discussion"
]


def var_extraction(input: str):

    extracted_values = {}

    # A function to escape field names for regex

    def escape_field(field):
        return re.escape(field) + r':\s*'

    # Looping through each field and extract its value
    for i, field in enumerate(fields):
        # The regex pattern for the current field
        if i < len(fields) - 1:
            # If not the last field, extract up to the next field
            pattern = rf'{escape_field(field)}(.*?)(?={escape_field(fields[i + 1])})'
        else:
            # If the last field, extract up to Decision
            pattern = rf'{escape_field(field)}(.*?)(?={escape_field("Decision")})'

        match = re.search(pattern, input, re.DOTALL)
        if match:
            extracted_values[field] = match.group(1).strip()

    # Split the string by ',' to separate each attendee with designation
    attendee_list = [item.strip()
                     for item in extracted_values["Attendees"].split(',')]

    # Extract component details in the Decision field
    lines = input.strip().split('\n')
    i = 1

    total_pc1_cost = 0
    total_revised_cost = 0

    components = []

    # Extracting all the components from the decision field
    while True:
        component_name_key = f"Component_name_{i}"
        component_pc1_key = f"Component_pc1_cost_{i}"
        component_revised_cost_key = f"Component_revised_cost_{i}"

        try:

            if any(line.strip().startswith(component_name_key) for line in lines):
                component = {}
                for line in lines:
                    if line.strip().startswith(component_name_key):
                        component["name"] = line.split(":")[
                            1].strip()
                    elif line.strip().startswith(component_pc1_key):
                        component["pc1"] = line.split(":")[
                            1].strip().replace(",", "").strip("$")
                    elif line.strip().startswith(component_revised_cost_key):
                        component["revised"] = line.split(":")[
                            1].strip().replace(",", "").strip("$")
                components.append(component)
                i += 1
                pc1_without_dollar_sign = component["pc1"]
                revised_without_dollar_sign = component["revised"]

                # Calculating the total costs of all the components
                total_pc1_cost += float(pc1_without_dollar_sign)
                total_revised_cost += float(revised_without_dollar_sign)
            else:
                break

        except:
            continue

    extracted_values["total_pc1_cost"] = total_pc1_cost
    extracted_values["total_revised_cost"] = total_revised_cost

    context = {key: value for key, value in extracted_values.items()}
    context['components'] = components
    context['attendeeList'] = attendee_list
    return context


# LLM
def mins_gen(input: str):


    llm = ChatOllama(
        model="llama3",
        temperature=0.1,)

    prompt = PromptTemplate.from_template("""

    From the following text delimited by triple backquotes: 
    
    ```{input}```
      
    I want you to fill all of these fields: 
                                    
    Meeting_date.
    Attendees.
    Project_name.
    Project_id.
    Project_proposed_revised_cost.
    Discussion.
    Decision. 
            
    For the Decision field, I want all components' information in the form of Component_name, Component_pc1_cost, and Component_revised_cost. I want all of these components as separate fields with their own numbering like: Component_name_1, Component_pc1_cost_1, etc.
    
    The output should provide all of these fields followed by the answer.
    
    The output should not contain any extra text.
    
    Here is a reference ouput:
    
    Meeting_date: 2024-01-15
    Attendees: Mohammad Basit (Chairperson), Syed Arsalan Ahmed Khan (Chief CMPQD), Mr. Raheem Kakar (Superintending Engg), Mr. Abbas Ahmed (Executive Engg)
    Project_name: Expansion of Central Park
    Project_id: A2024.001
    Project_proposed_revised_cost: 5245.00
    
    Discussion: The discussion began with a detailed discussion on the Expansion of Central Park. Mohammad Basit highlighted initial delays caused by supply chain disruptions and proposed sourcing materials from alternative suppliers to mitigate these issues. Syed Arsalan Ahmed Khan then proposed the inclusion of an additional children's playground area, which received unanimous support. Raheem Kakar raised a critical point regarding the environmental impact assessment, stressing its importance for the local ecosystem. It was decided to hire an independent environmental consultant to carry out this assessment. Abbas Ahmed confirmed that the revised budget of $5000.00 would be sufficient to cover these new inclusions and necessary environmental reviews.

    Decision:
    
    Component_name_1: Landscaping and Horticulture,
    Component_pc1_cost_1: 150000,
    Component_revised_cost_1: 180000

    Component_name_2: Playground Equipment Installation,
    Component_pc1_cost_2: 300000,
    Component_revised_cost_2: 350000

    Component_name_3: Walking Paths Construction,
    Component_pc1_cost_3: 200000,
    Component_revised_cost_3: 225000

    Component_name_4: Lighting and Electrical Works,
    Component_pc1_cost_4: 100000,
    Component_revised_cost_4: 125000

    Component_name_5: Security Fencing,
    Component_pc1_cost_5: 75000,
    Component_revised_cost_5: 90000
    """)

    llm_chain = prompt | llm

    output = llm_chain.invoke({"input": input})

    json_dict = var_extraction(str(output.content))

    return {"text": str(output.content), "json_dict": json_dict}


if __name__ == "__main__":

    # The text I gave to the model was:
    # This meeting was held in 2024-01-15. The attendees of this meeting were: Mohammad Basit (Chairperson), Syed Arsalan Ahmed Khan (Chief CMPQD), Mr. Raheem Kakar (Superintending Engg), and Mr. Abbas Ahmed (Executive Engg). The agenda of this meeting was the Expansion of Central Park that has the project ID of A2024.001 and a proposed revised cost of 5245.00. The discussion about the project began witha detailed discussion on the Expansion of Central Park. Mohammad Basit highlighted the initial delays caused by supply chain disruptions and proposed sourcing materials from alternative suppliers to mitigate these issues. His suggestion was well-received, and it was agreed that this would significantly reduce further delays. Syed Arsalan Ahmed Khan then proposed the inclusion of an additional children's playground area, which he argued would enhance the park's appeal and provide more recreational space for families. This proposal received unanimous support from the attendees. Mr. Raheem Khan the Senior Engineer, raised a critical point regarding the environmental impact assessment. He stressed the importance of conducting a comprehensive review to ensure that the expansion would not adversely affect the local ecosystem. It was decided that an independent environmental consultant would be hired to carry out this assessment. Mr. Abbas Ahmed finally confirmed that the revised budget of $5000.00 would be sufficient to cover these new inclusions and the necessary environmental reviews. The discussion concluded with a unanimous decision to approve the revised plan and budget, pending the environmental assessment. The decisions reached for he Expansion of Central Park project was that the initial cost estimates and the revised costs for five key components were noted. The first component, Landscaping and Horticulture, had an initial estimated cost (PC-I Cost) of $150,000, which was later revised to $180,000 in the 2nd Revised PC-1 Approved Cost. The second component, Playground Equipment Installation, originally estimated at $300,000, saw an increase in the revised cost to $350,000. Walking Paths Construction, the third component, had its initial cost set at $200,000, with a slight revision to $225,000. The fourth component, Lighting and Electrical Works, initially costed at $100,000, was revised to $125,000. Finally, Security Fencing, the fifth component, had its initial cost of $75,000 increased to $90,000 in the revised estimates. Summing up all these components, the total construction cost was initially $825,000, which was revised to $970,000.

    # This meeting was held on 2024-02-20. The attendees of this meeting were: Ayesha Khan (Chairperson), Imran Ali (Chief Engineer), Dr. Fatima Tariq (Environmental Specialist), and Mr. Asad Mehmood (Project Manager). The agenda of this meeting was the Renovation of Riverside Park, which has the project ID of B2024.002 and a proposed revised cost of 6020.00. The discussion about the project began with a detailed discussion on the Renovation of Riverside Park. Ayesha Khan highlighted the initial challenges due to unexpected weather conditions and proposed implementing more weather-resistant materials to mitigate these issues. Her suggestion was well-received, and it was agreed that this would significantly reduce future maintenance costs. Imran Ali then proposed the addition of a new fitness trail, which he argued would enhance the park's appeal and provide more recreational opportunities for visitors. This proposal received unanimous support from the attendees. Dr. Fatima Tariq, the Environmental Specialist, raised a critical point regarding the potential impact on local wildlife. She stressed the importance of conducting a thorough environmental impact assessment to ensure that the renovation would not harm the local ecosystem. It was decided that an independent environmental consultant would be hired to carry out this assessment. Mr. Asad Mehmood finally confirmed that the revised budget of $5800.00 would be sufficient to cover these new inclusions and the necessary environmental reviews. The discussion concluded with a unanimous decision to approve the revised plan and budget, pending the environmental assessment. The decisions reached for the Renovation of Riverside Park project included noting the initial cost estimates and the revised costs for five key components. The first component, Landscaping and Horticulture, had an initial estimated cost (PC-I Cost) of $140,000, which was later revised to $160,000 in the 2nd Revised PC-1 Approved Cost. The second component, Playground Equipment Installation, originally estimated at $280,000, saw an increase in the revised cost to $320,000. Walking Paths Construction, the third component, had its initial cost set at $190,000, with a slight revision to $210,000. The fourth component, Lighting and Electrical Works, initially costed at $90,000, was revised to $110,000. Finally, Security Fencing, the fifth component, had its initial cost of $65,000 increased to $80,000 in the revised estimates. Summing up all these components, the total construction cost was initially $765,000, which was revised to $880,000.

    user_input = input("You: ")
    response = mins_gen(user_input)
    print("Assistant: ", response)

    print("This is the type of the response:")
    print(type(response))
