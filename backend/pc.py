from langchain_core.prompts import PromptTemplate
import re

# List of variable names to extract
variable_names = [
    "name_of_the_project",
    "location",
    "authorities_responsible_for_sponsoring",
    "authorities_responsible_for_execution",
    "authorities_responsible_for_operation_and_maintenance",
    "authorities_responsible_for_concerned_federal_ministry",
    "plan_provision",
    "project_objectives_and__relationship_with_sectoral_objective",
    "project_description_and_justification_and_technical_parameters",
    "capital_cost_estimates",
    "annual_operation_and_maintenance_cost_after_project_completion",
    "demand_and_supply_analysis",
    "financial_plan_and_mode_of_financing",
    "project_financial_benefits",
    "project_social_benefits_with_indicators",
    "project_employment_generation",
    "project_environmental_impact",
    "project_impact_of_delays_on_project_cost_and_viability",
    "implementation_schedule",
    "result_based_monitoring_indicators_RBM_indicators",
    "management_structure_and_manpower_requirements",
    "additional_projects_decisions_required_to_maximize_socio_economic_benefits"
]

# methods that extract the relevant variables from the llm output.
def var_extraction(text: str):
    # Dictionary to store extracted values
    extracted_values = {}

    # Loop through each variable name and extract its value
    for var in variable_names:
        pattern = re.compile(rf"{var}: (.+?)(?:\n|$)")
        match = pattern.search(text)
        if match:
            extracted_values[var] = match.group(1).strip()
            
    return extracted_values


# LLM
def pc1(input: str):

    from langchain_ollama import ChatOllama

    llm = ChatOllama(
        model="llama3",
        temperature=0.1,
)

    # Prompt template
    prompt = PromptTemplate.from_template("""

    From the following text delimited by triple backquotes: 
    
    ```{input}```
      
      
    I want you to fill these 22 fields: 
                                    
    I have a form with the following fields: 
    1. name_of_the_project. 
    2. location.
    3. authorities_responsible_for_sponsoring.
    4. authorities_responsible_for_execution.
    5. authorities_responsible_for_operation_and_maintenance.
    6. authorities_responsible_for_concerned_federal_ministry.
    7. plan_provision.
    8. project_objectives_and__relationship_with_sectoral_objective.
    9. project_description_and_justification_and_technical_parameters.
    10. capital_cost_estimates.
    11. annual_operation_and_maintenance_cost_after_project_completion. 
    12. demand_and_supply_analysis.
    13. financial_plan_and_mode_of_financing.
    14. project_financial_benefits.
    15. project_social_benefits_with_indicators.
    16. project_employment_generation.
    17. project_environmental_impact. 
    18. project_impact_of_delays_on_project_cost_and_viability.
    19. implementation_schedule.
    20. result_based_monitoring_indicators_RBM_indicators.
    21. management_structure_and_manpower_requirements.
    22. additional_projects_decisions_required_to_maximize_socio_economic_benefits.

    The output should provide all of the 22 fields followed by the answer.
    The output should not contain any extra text.
    """)
    

    llm_chain = prompt | llm

    output = llm_chain.invoke({"input": input})
    print(output.content)

    # return output
    
    extracted_values = var_extraction(str(output.content))

    return {"text": str(output.content), "text_dict": extracted_values}
# 
    print(type(output))

    # return output


if __name__ == "__main__":

    # The text I gave to the model was:
    # The Comprehensive Education Improvement Initiative, sponsored by the Government of X through the National Development Fund, aims to enhance educational infrastructure and resources in both urban and rural areas of the X Region. This project, which falls under the purview of the Ministry of Education and Literacy, will be executed by the Department of Education and maintained by the Education Program Management Unit (EPMU). It is included in the National Development Plan with a budget of $15 million. The project's primary objectives are to improve access to quality education, reduce dropout rates, and increase enrolment, particularly for girls. This initiative also seeks to enhance teacher skills and integrate technology into the learning process. By aligning with the national education policy and Sustainable Development Goals (SDG 4), the project aims to promote inclusive and equitable quality education and lifelong learning opportunities. The initiative involves the construction of 50 new schools and the renovation of 100 existing ones, distribution of 20,000 textbooks, 1,000 tablets, and 500 projectors, and training 2,000 teachers through continuous professional development programs. A pilot e-learning program will be launched in 50 schools. The justification for this project lies in addressing the high dropout rates, inadequate school facilities, and untrained teachers in the region, which are critical barriers to social and economic development. The estimated capital cost for the project is $15 million, with an annual operating and maintenance cost of $700,000 after completion. The project will be funded by the Government of X through the National Development Fund, supplemented by international educational grants and private sector partnerships. Demand for improved educational facilities and resources is high in the region, and current supply is insufficient to meet the needs of the growing student population. Financially, the project is expected to generate long-term economic benefits through a more educated workforce, leading to higher productivity and earnings. Social benefits include improved literacy rates, increased school enrolment and attendance (especially among girls), and better health and nutrition for students due to school feeding programs. Direct employment opportunities will be created for construction workers, teachers, and administrative staff, while indirect benefits will accrue to local businesses and service providers. The project will employ sustainable building materials and energy-efficient technologies to minimize environmental impact. The implementation schedule spans three years, with key milestones every six months. Delays in the project could lead to increased costs due to inflation and disrupt the educational progress of students. Result-based monitoring indicators include a 20% increase in school enrolment, a 15% decrease in dropout rates, and a 10% improvement in literacy and numeracy test scores. The project will be overseen by a Project Steering Committee (PSC) for strategic guidance, with day-to-day management handled by the Education Program Management Unit (EPMU). Manpower requirements include project managers, educational consultants, construction supervisors, teachers, IT specialists, and administrative support staff. Additional initiatives, such as collaboration with local NGOs for community outreach and vocational training programs for youth, will maximize the socio-economic benefits of the project.

    #The Comprehensive Health Enhancement Program, sponsored by the Government of Y through the National Health Fund, aims to improve healthcare infrastructure and resources in both urban and rural areas of the Y Region. This project, which falls under the purview of the Ministry of Health and Wellness, will be executed by the Department of Health and maintained by the Health Program Management Unit (HPMU). It is included in the National Health Plan with a budget of $20 million. The project's primary objectives are to improve access to quality healthcare, reduce disease incidence, and increase vaccination rates, particularly for children. This initiative also seeks to enhance healthcare worker skills and integrate technology into the healthcare system. By aligning with the national health policy and Sustainable Development Goals (SDG 3), the project aims to ensure healthy lives and promote well-being for all at all ages. The initiative involves the construction of 30 new clinics and the renovation of 70 existing ones, distribution of 50,000 medical kits, 2,000 tablets, and 800 medical imaging devices, and training 3,000 healthcare workers through continuous professional development programs. A pilot telemedicine program will be launched in 30 clinics. The justification for this project lies in addressing the high disease rates, inadequate healthcare facilities, and untrained healthcare workers in the region, which are critical barriers to social and economic development. The estimated capital cost for the project is $20 million, with an annual operating and maintenance cost of $900,000 after completion. The project will be funded by the Government of Y through the National Health Fund, supplemented by international health grants and private sector partnerships. Demand for improved healthcare facilities and resources is high in the region, and current supply is insufficient to meet the needs of the growing population. Financially, the project is expected to generate long-term economic benefits through a healthier workforce, leading to higher productivity and reduced healthcare costs. Social benefits include reduced disease incidence, increased vaccination rates, and better health outcomes for patients due to improved healthcare services. Direct employment opportunities will be created for construction workers, healthcare workers, and administrative staff, while indirect benefits will accrue to local businesses and service providers. The project will employ sustainable building materials and energy-efficient technologies to minimize environmental impact. The implementation schedule spans four years, with key milestones every six months. Delays in the project could lead to increased costs due to inflation and disrupt the healthcare progress of the population. Result-based monitoring indicators include a 25% increase in vaccination rates, a 20% decrease in disease incidence, and a 15% improvement in patient health outcomes. The project will be overseen by a Project Steering Committee (PSC) for strategic guidance, with day-to-dinputay management handled by the Health Program Management Unit (HPMU). Manpower requirements include project managers, healthcare consultants, construction supervisors, healthcare workers, IT specialists, and administrative support staff. Additional initiatives, such as collaboration with local NGOs for community outreach and health education programs for youth, will maximize the socio-economic benefits of the project.

    user_input = input("You: ")
    response = pc1(user_input)
    print("Assistant: ", response)

    print("This is the type of the response:")
    print(type(response))
    
    # var_extraction(response)
