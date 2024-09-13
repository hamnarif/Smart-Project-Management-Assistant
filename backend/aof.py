import pandas as pd

from docxtpl import DocxTemplate

# The policies for projects
policies = {"curr_cost > 0 and curr_cost <= 30": 100, "curr_cost > 30 and curr_cost <= 100": 50,
            "curr_cost > 100 and curr_cost <= 200": 35, "curr_cost > 200": 25}

# The variables to be extracted from the data.
policy_cols = ["PSDPNo", "ProjectID", "ProjectName", "Year",
               "CostTotal", "ExpUptoTotal", "ExecDept"]

# varibles to be inserted into the template document
normal_policy_keys = ["pNo", "pId", "pName", "year", "cost", "exp", "eA"]
normal_policy_values = ["", "", "", "", "", "", ""]

calc_policy_keys = ["allocate", "tF"]
calc_policy_values = ["", ""]

rows = []

total_allocated = 0


def amount_calc(cost: int, exp: int, index: int, row: dict):
    global total_allocated

    curr_cost = cost - exp

    for policy in policies:
        if eval(policy):

            new_cost = curr_cost * (policies[policy] / 100)

            total_allocated += new_cost

            row[calc_policy_keys[0]] = str(round(new_cost, 3))
            row[calc_policy_keys[1]] = str(round(curr_cost - new_cost, 3))

            break
    rows.append(row)

    return 0


def aof_gen():
    df = pd.read_excel("documents/aof_policies.xlsx")
    # df = pd.read_excel("naya.xlsx")
    
    for index, curr_row in df.iterrows():

        row = {}

        for i, value in enumerate(normal_policy_keys):
            row[normal_policy_keys[i]] = df.loc[index, policy_cols[i]]
            
        amount_calc(curr_row['CostTotal'],
                    curr_row['ExpUptoTotal'], index, row)

    context = {"rows": rows, "total_cost": round(total_allocated, 2)}

    doc = DocxTemplate("documents/aof_template.docx")
    doc.render(context)
    doc.save("files/aof_actual.docx")

    return "aof generated"
        
    

if __name__ == "__main__":
    aof_gen()
