import pandas as pd

from docxtpl import DocxTemplate

policies = {"curr_cost > 0 and curr_cost <= 30": 100, "curr_cost > 30 and curr_cost <= 100": 50,
            "curr_cost > 100 and curr_cost <= 200": 35, "curr_cost > 200": 25}

policy_cols = ["PSDPNo", "ProjectID", "ProjectName",
               "CostTotal", "ExpUptoTotal", "ExecDept"]

normal_policy_keys = ["pNo1", "pId1", "pName1", "cost1", "exp1", "eA1"]
normal_policy_values = ["", "", "", "", "", "", ""]

calc_policy_keys = ["allocate1", "tF1"]
calc_policy_values = ["", ""]

context = {}


def amount_calc(cost: int, exp: int, index: int):

    curr_cost = cost - exp

    for policy in policies:
        if eval(policy):

            new_cost = curr_cost * (policies[policy] / 100)

            calc_policy_keys[0] = calc_policy_keys[0][:-1] + str(index + 1)
            calc_policy_values[0] = str(round(new_cost, 3))

            calc_policy_keys[1] = calc_policy_keys[1][:-1] + str(index + 1)
            calc_policy_values[1] = str(round(curr_cost - new_cost, 3))

            context[calc_policy_keys[0]] = calc_policy_values[0]

            context[calc_policy_keys[1]] = calc_policy_values[1]

            break

    return 0


df = pd.read_excel("naya.xlsx", nrows=5)


for index, row in df.iterrows():

    for i, value in enumerate(normal_policy_keys):
        normal_policy_keys[i] = value[:-1] + str(index + 1)
        normal_policy_values[i] = df.loc[index, policy_cols[i]]
        context[normal_policy_keys[i]] = normal_policy_values[i]

    amount_calc(row['CostTotal'], row['ExpUptoTotal'], index)

# print(context)

doc = DocxTemplate("One.docx")
doc.render(context)
doc.save("Two.docx")
