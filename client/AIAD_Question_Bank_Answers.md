# AIAD Practical Question Bank: Answers

All programs use plain Python, `numpy`, `pandas` and `scikit-learn`, matching the style of your practical file. Each one prints its own output, so no `input()` is needed. Datasets are small made-up ones, as the questions allow.

---

## Q1) PEAS for a vacuum cleaner agent + table-driven agent

**PEAS**

| Component | Description |
|---|---|
| Performance measure | Cleanliness of rooms, number of rooms cleaned, less energy/time/moves used |
| Environment | Rooms A and B, floor, dirt |
| Actuators | Wheels (move Left/Right), suction/brush (Suck) |
| Sensors | Dirt sensor, location sensor |

**Environment classification:** Partially observable (only sees its own room), deterministic, episodic, static, discrete, single-agent.

```python
table = {
    ("A", "Dirty"): "Suck",
    ("A", "Clean"): "Right",
    ("B", "Dirty"): "Suck",
    ("B", "Clean"): "Left"
}

percepts = [("A", "Dirty"), ("A", "Clean"), ("B", "Dirty"), ("B", "Clean")]
for p in percepts:
    print("Percept:", p, "-> Action:", table[p])
```

---

## Q2) Shortest path using BFS (unweighted graph)

Edges read from the figure: A-B, A-E, B-C, B-D, C-D, D-E, D-F, E-F.

```python
from collections import deque

graph = {
    'A': ['B', 'E'],
    'B': ['A', 'C', 'D'],
    'C': ['B', 'D'],
    'D': ['B', 'C', 'E', 'F'],
    'E': ['A', 'D', 'F'],
    'F': ['D', 'E']
}

def bfs_shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for neighbour in graph[node]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(path + [neighbour])
    return None

path = bfs_shortest_path(graph, 'A', 'D')
print("Shortest Path:", path)
print("Number of edges:", len(path) - 1)
```

---

## Q3) Water jug (5 L and 3 L), exactly 4 L, using DFS

```python
def water_jug_dfs(cap1, cap2, target):
    start = (0, 0)
    stack = [(start, [start])]
    visited = set()
    while stack:
        (x, y), path = stack.pop()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        if x == target or y == target:
            return path
        t1 = min(x, cap2 - y)      # pour jug1 -> jug2
        t2 = min(y, cap1 - x)      # pour jug2 -> jug1
        next_states = [
            (cap1, y),             # fill jug1
            (x, cap2),             # fill jug2
            (0, y),                # empty jug1
            (x, 0),                # empty jug2
            (x - t1, y + t1),
            (x + t2, y - t2)
        ]
        for state in next_states:
            if state not in visited:
                stack.append((state, path + [state]))
    return None

solution = water_jug_dfs(5, 3, 4)
if solution:
    for step in solution:
        print(step)
    print("Target Reached")
else:
    print("No solution")
```

Your earlier code printed visited states and never stored the path. This version also fixes the pour logic and prints the actual solution path.

---

## Q4) Least-cost path using UCS (weighted graph)

Edges from the figure: A-B 2, A-C 3, B-G 5, B-E 4, C-D 1, D-E 2, E-F 4, F-G 1. Start = A, Destination = G.

```python
import heapq

graph = {
    'A': {'B': 2, 'C': 3},
    'B': {'A': 2, 'G': 5, 'E': 4},
    'C': {'A': 3, 'D': 1},
    'D': {'C': 1, 'E': 2},
    'E': {'B': 4, 'D': 2, 'F': 4},
    'F': {'E': 4, 'G': 1},
    'G': {'B': 5, 'F': 1}
}

def ucs(graph, start, goal):
    pq = [(0, start, [start])]
    visited = set()
    while pq:
        cost, node, path = heapq.heappop(pq)
        if node == goal:
            return path, cost
        if node in visited:
            continue
        visited.add(node)
        for neighbour, weight in graph[node].items():
            if neighbour not in visited:
                heapq.heappush(pq, (cost + weight, neighbour, path + [neighbour]))
    return None, float('inf')

path, cost = ucs(graph, 'A', 'G')
print("Least Cost Path:", path)
print("Total Cost:", cost)
```

Output: `['A', 'B', 'G']`, cost 7.

---

## Q5) Probability of rain given a rainy forecast (Bayes)

P(Rain) = 0.3, P(Forecast | Rain) = 0.8, P(Forecast | No Rain) = 0.2

```python
P_rain = 0.30
P_forecast_given_rain = 0.80
P_forecast_given_no_rain = 0.20

P_no_rain = 1 - P_rain
P_forecast = (P_forecast_given_rain * P_rain) + (P_forecast_given_no_rain * P_no_rain)
P_rain_given_forecast = (P_forecast_given_rain * P_rain) / P_forecast

print("P(Rainy Forecast):", round(P_forecast, 2))
print("P(Rain | Rainy Forecast):", round(P_rain_given_forecast, 4))
```

Output: 0.6316 (about 63.2%).

---

## Q6) Naïve Bayes: play outdoors (Outlook, Temperature, Humidity, Wind)

```python
import pandas as pd
from sklearn.naive_bayes import CategoricalNB
from sklearn.preprocessing import OrdinalEncoder, LabelEncoder

data = {
    'Outlook':     ['Sunny','Sunny','Overcast','Rain','Rain','Rain','Overcast',
                    'Sunny','Sunny','Rain','Sunny','Overcast','Overcast','Rain'],
    'Temperature': ['Hot','Hot','Hot','Mild','Cool','Cool','Cool',
                    'Mild','Cool','Mild','Mild','Mild','Hot','Mild'],
    'Humidity':    ['High','High','High','High','Normal','Normal','Normal',
                    'High','Normal','Normal','Normal','High','Normal','High'],
    'Wind':        ['Weak','Strong','Weak','Weak','Weak','Strong','Strong',
                    'Weak','Weak','Weak','Strong','Strong','Weak','Strong'],
    'Play':        ['No','No','Yes','Yes','Yes','No','Yes',
                    'No','Yes','Yes','Yes','Yes','Yes','No']
}
df = pd.DataFrame(data)

features = ['Outlook', 'Temperature', 'Humidity', 'Wind']
enc = OrdinalEncoder()
X = enc.fit_transform(df[features])
le = LabelEncoder()
y = le.fit_transform(df['Play'])

model = CategoricalNB()
model.fit(X, y)

new = pd.DataFrame([['Sunny', 'Cool', 'High', 'Strong']], columns=features)
pred = model.predict(enc.transform(new))
proba = model.predict_proba(enc.transform(new))

print("New day:", new.values[0])
print("Probabilities (No, Yes):", proba.round(3))
print("Prediction: Play =", le.inverse_transform(pred)[0])
```

---

## Q7) Linear Regression: Study Hours, Attendance, Total Marks

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

students = [[2, 60, 45], [3, 65, 50], [4, 70, 58], [5, 72, 62], [5, 75, 65],
            [6, 80, 72], [7, 82, 76], [7, 85, 80], [8, 90, 88], [9, 95, 94]]
arr = np.array(students)
x = arr[:, 0:2]
y = arr[:, 2]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(x_train, y_train)
y_pred = model.predict(x_test)

print("Test Results")
for i in range(len(y_test)):
    print("Input:", x_test[i], "Actual:", y_test[i], "Predicted:", round(y_pred[i], 2))

print("MAE :", round(mean_absolute_error(y_test, y_pred), 2))
print("MSE :", round(mean_squared_error(y_test, y_pred), 2))
print("RMSE:", round(np.sqrt(mean_squared_error(y_test, y_pred)), 2))

# Predict marks for a new student: 6.5 study hours, 78% attendance
new_student = np.array([[6.5, 78]])
print("Predicted Marks for new student:", round(model.predict(new_student)[0], 2))
```

---

## Q8) Logistic Regression: credit card fraud

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# [Amount, Hour, Transactions in last 24h, Fraudulent]
transactions = [
    [500, 10, 2, 0], [1200, 14, 3, 0], [300, 9, 1, 0], [2500, 18, 4, 0],
    [700, 12, 2, 0], [900, 11, 3, 0], [1500, 15, 2, 0], [2000, 16, 4, 0],
    [15000, 2, 12, 1], [18000, 1, 15, 1], [9000, 3, 10, 1], [20000, 23, 18, 1],
    [12000, 4, 11, 1], [14000, 1, 14, 1], [16000, 3, 13, 1], [11000, 2, 12, 1]
]
arr = np.array(transactions)
X = arr[:, 0:3]
y = arr[:, 3]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

for i in range(len(y_test)):
    print("INPUT:", X_test[i],
          "ACTUAL:", "FRAUDULENT" if y_test[i] == 1 else "NOT FRAUDULENT",
          "PREDICTED:", "FRAUDULENT" if y_pred[i] == 1 else "NOT FRAUDULENT")

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, zero_division=0))

new_txn = np.array([[17000, 2, 14]])
print("New transaction:", "FRAUDULENT" if model.predict(new_txn)[0] == 1 else "NOT FRAUDULENT")
```

---

## Q9) Decision Tree: email spam (Links, Suspicious Words, Message Length)

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# [Links, Suspicious Words, Message Length, Spam (1) / Not Spam (0)]
emails = [
    [0, 0, 200, 0], [1, 0, 150, 0], [0, 1, 300, 0], [1, 1, 250, 0],
    [0, 0, 120, 0], [2, 0, 180, 0], [1, 0, 400, 0], [0, 1, 220, 0],
    [8, 6, 80, 1], [10, 7, 60, 1], [6, 5, 90, 1], [12, 8, 50, 1],
    [7, 4, 70, 1], [9, 6, 100, 1], [11, 9, 40, 1], [5, 5, 110, 1]
]
arr = np.array(emails)
X = arr[:, 0:3]
y = arr[:, 3]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)

model = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))
print(classification_report(y_test, y_pred, target_names=["Not Spam", "Spam"], zero_division=0))

new_email = np.array([[9, 6, 55]])
print("New email:", "SPAM" if model.predict(new_email)[0] == 1 else "NOT SPAM")
```

---

## Q10) KNN: customer group (Age, Annual Income)

```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix

# [Age, Annual Income (thousands), Customer Group]
customers = [
    [20, 25, 0], [22, 30, 0], [24, 28, 0], [26, 35, 0], [28, 32, 0],
    [35, 50, 1], [38, 55, 1], [40, 60, 1], [42, 58, 1], [45, 65, 1],
    [50, 75, 2], [52, 80, 2], [55, 85, 2], [58, 90, 2], [60, 95, 2]
]
arr = np.array(customers)
X = arr[:, 0:2]
y = arr[:, 2]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

groups = {0: "Young Low Income", 1: "Middle Age Medium Income", 2: "Older High Income"}
new_customer = np.array([[44, 62]])
print("New customer group:", groups[model.predict(new_customer)[0]])
```

---

## Q11) Decision Tree: student performance (Low / Medium / High)

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# [Study Hours, Attendance, Assignment Score, Performance: 0=Low, 1=Medium, 2=High]
students = [
    [2, 50, 30, 0], [3, 55, 35, 0], [2, 60, 40, 0], [3, 52, 38, 0], [1, 48, 25, 0],
    [5, 70, 60, 1], [4, 72, 55, 1], [6, 68, 62, 1], [5, 75, 58, 1], [4, 70, 65, 1],
    [8, 90, 85, 2], [9, 95, 90, 2], [7, 88, 82, 2], [8, 92, 95, 2], [9, 96, 88, 2]
]
arr = np.array(students)
X = arr[:, 0:3]
y = arr[:, 3]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, labels=[0, 1, 2],
                            target_names=["Low", "Medium", "High"], zero_division=0))

labels = {0: "Low", 1: "Medium", 2: "High"}
new_student = np.array([[6, 80, 75]])
print("Predicted Performance:", labels[model.predict(new_student)[0]])
```

---

## Q12) 5-fold cross-validation on Logistic Regression

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# [Hours Studied, Previous Score, Pass (1) / Fail (0)]
data = [
    [1, 35, 0], [2, 40, 0], [3, 45, 0], [2, 38, 0], [1, 30, 0],
    [3, 50, 0], [4, 48, 0], [2, 42, 0], [3, 44, 0], [1, 33, 0],
    [6, 65, 1], [7, 70, 1], [8, 75, 1], [6, 68, 1], [9, 80, 1],
    [7, 72, 1], [8, 78, 1], [5, 60, 1], [9, 85, 1], [6, 66, 1]
]
arr = np.array(data)
X = arr[:, 0:2]
y = arr[:, 2]

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kf)

for i, s in enumerate(scores, 1):
    print("Fold", i, "Accuracy:", round(s, 2))
print("Mean Accuracy:", round(scores.mean(), 2))
```

---

## Q13) BFS traversal of the given graph

```python
import networkx as nx

G = nx.Graph()
edges = [('A', 'B'), ('B', 'C'), ('B', 'D'), ('C', 'E'), ('D', 'E'), ('E', 'F')]
G.add_edges_from(edges)

bfs_order = list(nx.bfs_tree(G, source='A'))
print("BFS Traversal:", bfs_order)
```

Output: `['A', 'B', 'C', 'D', 'E', 'F']`

---

## Q14) Bayes' theorem for custom input values

```python
P_A = float(input("Enter P(A) (prior): "))
P_B_given_A = float(input("Enter P(B|A) (likelihood): "))
P_B = float(input("Enter P(B) (evidence): "))

P_A_given_B = (P_B_given_A * P_A) / P_B
print("P(A|B) =", round(P_A_given_B, 4))
```

Sample input: 0.3, 0.9, 0.4 gives P(A|B) = 0.675.

---

## Q15) A* search: Wadala to Gateway of India

Edges: Wadala-Bandra 9, Wadala-Dadar 5, Bandra-Worli 7, Dadar-Worli 6, Dadar-Marine Drive 12, Worli-Marine Drive 8, Marine Drive-Gateway of India 3.
Heuristics: Wadala 15, Bandra 14, Dadar 12, Worli 7, Marine Drive 3, Gateway 0.

```python
import heapq

graph = {
    'Wadala': {'Bandra': 9, 'Dadar': 5},
    'Bandra': {'Wadala': 9, 'Worli': 7},
    'Dadar': {'Wadala': 5, 'Worli': 6, 'Marine Drive': 12},
    'Worli': {'Bandra': 7, 'Dadar': 6, 'Marine Drive': 8},
    'Marine Drive': {'Dadar': 12, 'Worli': 8, 'Gateway of India': 3},
    'Gateway of India': {'Marine Drive': 3}
}

h = {
    'Wadala': 15, 'Bandra': 14, 'Dadar': 12,
    'Worli': 7, 'Marine Drive': 3, 'Gateway of India': 0
}

def astar(start, goal):
    pq = [(h[start], 0, start, [start])]     # (f, g, node, path)
    best_g = {}
    while pq:
        f, g, node, path = heapq.heappop(pq)
        if node == goal:
            return path, g
        if node in best_g and best_g[node] <= g:
            continue
        best_g[node] = g
        for neighbour, cost in graph[node].items():
            new_g = g + cost
            heapq.heappush(pq, (new_g + h[neighbour], new_g, neighbour, path + [neighbour]))
    return None, float('inf')

path, cost = astar('Wadala', 'Gateway of India')
print("Optimal Path:", " -> ".join(path))
print("Total Cost:", cost, "km")
```

Output: Wadala -> Dadar -> Marine Drive -> Gateway of India, 20 km.

---

## Q16) Logistic Regression: credit card fraud prediction

This is the same task as Q8. A compact version with a user-style prediction:

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# [Amount, Hour, Txns in last 24h, Fraudulent]
data = np.array([
    [500, 10, 2, 0], [1200, 14, 3, 0], [300, 9, 1, 0], [2500, 18, 4, 0],
    [700, 12, 2, 0], [900, 11, 3, 0],
    [15000, 2, 12, 1], [18000, 1, 15, 1], [9000, 3, 10, 1],
    [20000, 23, 18, 1], [12000, 4, 11, 1], [14000, 1, 14, 1]
])
X, y = data[:, :3], data[:, 3]

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X, y)

txn = np.array([[13000, 3, 12]])
prob = model.predict_proba(txn)[0][1]
print("Fraud probability:", round(prob, 3))
print("Result:", "FRAUDULENT" if model.predict(txn)[0] == 1 else "NOT FRAUDULENT")
```

---

## Q17) Naïve Bayes: spam emails (links, suspicious words, spam status)

```python
import numpy as np
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# [Number of Links, Suspicious Words, Spam (1) / Not Spam (0)]
emails = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [2, 0, 0], [0, 2, 0], [1, 2, 0], [2, 1, 0],
    [8, 6, 1], [10, 7, 1], [6, 5, 1], [12, 8, 1], [7, 4, 1], [9, 6, 1], [11, 9, 1], [5, 5, 1]
]
arr = np.array(emails)
X = arr[:, 0:2]
y = arr[:, 2]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)

model = GaussianNB()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))

new_email = np.array([[9, 5]])
print("New email (9 links, 5 suspicious words):",
      "SPAM" if model.predict(new_email)[0] == 1 else "NOT SPAM")
```

---

## Q18) Classify movies: Comedy / Drama / Action (Decision Tree)

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# [Duration (min), Action Scene Count, Genre: 0=Comedy, 1=Drama, 2=Action]
movies = [
    [95, 2, 0], [100, 3, 0], [90, 1, 0], [105, 4, 0], [98, 2, 0],
    [140, 3, 1], [150, 2, 1], [135, 4, 1], [160, 3, 1], [145, 1, 1],
    [120, 25, 2], [130, 30, 2], [115, 22, 2], [125, 28, 2], [135, 35, 2]
]
arr = np.array(movies)
X = arr[:, 0:2]
y = arr[:, 2]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))

genres = {0: "Comedy", 1: "Drama", 2: "Action"}
new_movie = np.array([[128, 27]])
print("Predicted Genre:", genres[model.predict(new_movie)[0]])
```

---

## Q19) Decision Tree Regression: monthly rent

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# [Area (sq ft), Rooms, Distance from station (km), Rent]
apartments = [
    [450, 1, 0.5, 18000], [500, 1, 1.0, 17000], [600, 2, 0.8, 26000],
    [650, 2, 1.5, 24000], [700, 2, 0.5, 30000], [800, 3, 1.0, 38000],
    [850, 3, 2.0, 34000], [900, 3, 0.7, 45000], [1000, 4, 1.2, 52000],
    [1100, 4, 2.5, 46000], [550, 2, 3.0, 19000], [750, 3, 3.5, 28000]
]
arr = np.array(apartments)
X = arr[:, 0:3]
y = arr[:, 3]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)

model = DecisionTreeRegressor(max_depth=3, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("MAE:", round(mean_absolute_error(y_test, y_pred), 2))
print("MSE:", round(mean_squared_error(y_test, y_pred), 2))
print("R2 :", round(r2_score(y_test, y_pred), 2))

new_flat = np.array([[720, 2, 1.0]])
print("Predicted Rent: Rs.", round(model.predict(new_flat)[0]))
```

---

## Q20) Decision Tree: will a person carry an umbrella?

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

data = {
    'Weather':  ['Sunny', 'Sunny', 'Cloudy', 'Rainy', 'Rainy', 'Rainy', 'Cloudy',
                 'Sunny', 'Cloudy', 'Rainy', 'Sunny', 'Cloudy'],
    'Humidity': ['High', 'Low', 'High', 'High', 'Low', 'High', 'Low',
                 'Low', 'High', 'Low', 'High', 'Low'],
    'Wind':     ['Weak', 'Weak', 'Weak', 'Strong', 'Weak', 'Weak', 'Strong',
                 'Strong', 'Strong', 'Strong', 'Weak', 'Weak'],
    'Umbrella': ['No', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'No',
                 'No', 'Yes', 'Yes', 'No', 'No']
}
df = pd.DataFrame(data)

df['Weather'] = df['Weather'].map({'Sunny': 0, 'Cloudy': 1, 'Rainy': 2})
df['Humidity'] = df['Humidity'].map({'Low': 0, 'High': 1})
df['Wind'] = df['Wind'].map({'Weak': 0, 'Strong': 1})
df['Umbrella'] = df['Umbrella'].map({'No': 0, 'Yes': 1})

X = df[['Weather', 'Humidity', 'Wind']]
y = df['Umbrella']

model = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
model.fit(X, y)

new_day = pd.DataFrame([[2, 1, 0]], columns=X.columns)   # Rainy, High, Weak
print("Carry umbrella?:", "YES" if model.predict(new_day)[0] == 1 else "NO")
```

---

## Q21) Linear Regression: electricity bill (units, days)

```python
import numpy as np
from sklearn.linear_model import LinearRegression

# [Units consumed, Number of days, Bill (Rs.)]
data = np.array([
    [100, 30, 650], [150, 30, 1000], [200, 31, 1400], [250, 30, 1800],
    [120, 28, 780], [300, 31, 2250], [180, 30, 1250], [220, 31, 1550],
    [90, 28, 560], [270, 30, 2000]
])
X = data[:, 0:2]
y = data[:, 2]

model = LinearRegression()
model.fit(X, y)

print("Coefficients (units, days):", model.coef_.round(2))
print("Intercept:", round(model.intercept_, 2))

household = np.array([[210, 30]])
print("Estimated bill: Rs.", round(model.predict(household)[0], 2))
```

---

## Q22) Bayesian Network: posterior probability of motor failure given robot stopped

Assumed probabilities (the question says "given", so replace with your own if provided):
P(Battery Low) = 0.2, P(Motor Failure) = 0.1,
P(Stopped | Low, Fail) = 0.95, P(Stopped | Low, OK) = 0.6, P(Stopped | OK, Fail) = 0.9, P(Stopped | OK, OK) = 0.05.

Battery and Motor Failure are both parents of Robot Stopped.

```python
P_battery_low = 0.2
P_motor_fail = 0.1

# P(Stopped=True | Battery, Motor)
P_stop = {
    ('Low', 'Fail'): 0.95,
    ('Low', 'OK'):   0.60,
    ('OK',  'Fail'): 0.90,
    ('OK',  'OK'):   0.05
}

P_battery = {'Low': P_battery_low, 'OK': 1 - P_battery_low}
P_motor = {'Fail': P_motor_fail, 'OK': 1 - P_motor_fail}

# Joint P(Motor, Stopped) by summing out Battery
joint = {}
for m in P_motor:
    joint[m] = sum(P_battery[b] * P_motor[m] * P_stop[(b, m)] for b in P_battery)

P_stopped = sum(joint.values())
posterior = joint['Fail'] / P_stopped

print("P(Robot Stopped):", round(P_stopped, 4))
print("P(Motor Failure | Robot Stopped):", round(posterior, 4))
```

Output: P(Stopped) = 0.235, posterior = 0.3872.

---

## Q23) Naïve Bayes: Genuine vs Suspicious reviews

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

reviews = [
    "great product works well good quality",
    "very useful and durable value for money",
    "excellent battery life and fast delivery",
    "satisfied with the quality happy purchase",
    "decent product as described works fine",
    "best product ever buy now amazing amazing amazing",
    "five stars buy buy buy must buy cheap",
    "click link for free gift best best best",
    "unbelievable deal visit website now discount",
    "perfect perfect perfect everyone must buy now"
]
labels = ["Genuine"] * 5 + ["Suspicious"] * 5

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(reviews)

model = MultinomialNB()
model.fit(X, labels)

tests = ["good quality and fast delivery", "buy now amazing amazing deal visit website"]
for t in tests:
    print(t, "->", model.predict(vectorizer.transform([t]))[0])
```

---

## Q24) Naïve Bayes: is it safe to fly the drone?

```python
import pandas as pd
from sklearn.naive_bayes import CategoricalNB
from sklearn.preprocessing import OrdinalEncoder, LabelEncoder

data = {
    'Weather':    ['Clear', 'Clear', 'Cloudy', 'Stormy', 'Cloudy', 'Stormy', 'Clear',
                   'Cloudy', 'Stormy', 'Clear', 'Cloudy', 'Stormy'],
    'Wind':       ['Low', 'Medium', 'Low', 'High', 'High', 'Medium', 'Low',
                   'Medium', 'High', 'High', 'Low', 'Low'],
    'Visibility': ['Good', 'Good', 'Good', 'Poor', 'Poor', 'Poor', 'Good',
                   'Good', 'Poor', 'Good', 'Good', 'Poor'],
    'Safe':       ['Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'Yes',
                   'Yes', 'No', 'No', 'Yes', 'No']
}
df = pd.DataFrame(data)

features = ['Weather', 'Wind', 'Visibility']
enc = OrdinalEncoder()
X = enc.fit_transform(df[features])
le = LabelEncoder()
y = le.fit_transform(df['Safe'])

model = CategoricalNB()
model.fit(X, y)

new = pd.DataFrame([['Clear', 'Low', 'Good']], columns=features)
pred = model.predict(enc.transform(new))
print("Conditions:", new.values[0])
print("Safe to fly?:", le.inverse_transform(pred)[0])
```

---

## Q25) Wizard's vessels (7 L and 4 L): exactly 5 L in the 7-litre vessel (DFS)

```python
def wizard_dfs(cap7, cap4, target):
    start = (0, 0)                      # (7-litre vessel, 4-litre vessel)
    stack = [(start, [start])]
    visited = set()
    while stack:
        (a, b), path = stack.pop()
        if (a, b) in visited:
            continue
        visited.add((a, b))
        if a == target:                 # exactly 5 L in the 7-litre vessel
            return path
        t1 = min(a, cap4 - b)           # pour 7L -> 4L
        t2 = min(b, cap7 - a)           # pour 4L -> 7L
        next_states = [
            (cap7, b), (a, cap4), (0, b), (a, 0),
            (a - t1, b + t1), (a + t2, b - t2)
        ]
        for s in next_states:
            if s not in visited:
                stack.append((s, path + [s]))
    return None

solution = wizard_dfs(7, 4, 5)
if solution:
    for step in solution:
        print(step)
    print("Potion of exactly 5 litres obtained in the 7-litre vessel")
else:
    print("Not possible")
```

---

## Q26) College graph (6 locations): shortest path using BFS

```python
from collections import deque

college = {
    'Main Gate': ['Admin Block', 'Parking'],
    'Admin Block': ['Main Gate', 'Library', 'Canteen'],
    'Parking': ['Main Gate', 'Canteen'],
    'Library': ['Admin Block', 'Computer Lab'],
    'Canteen': ['Admin Block', 'Parking', 'Ground'],
    'Computer Lab': ['Library', 'Ground'],
    'Ground': ['Canteen', 'Computer Lab']
}

def shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                queue.append(path + [nb])
    return None

path = shortest_path(college, 'Main Gate', 'Computer Lab')
print("Shortest path:", " -> ".join(path))
print("Number of steps:", len(path) - 1)
```

---

## Q27) Interconnected caves: DFS to find the treasure

```python
caves = {
    'Cave 1': ['Cave 2', 'Cave 3'],
    'Cave 2': ['Cave 1', 'Cave 4'],
    'Cave 3': ['Cave 1', 'Cave 5', 'Cave 6'],
    'Cave 4': ['Cave 2'],
    'Cave 5': ['Cave 3', 'Treasure Cave'],
    'Cave 6': ['Cave 3'],
    'Treasure Cave': ['Cave 5']
}

def dfs_path(graph, start, goal):
    stack = [(start, [start])]
    visited = set()
    while stack:
        node, path = stack.pop()
        if node == goal:
            return path
        if node in visited:
            continue
        visited.add(node)
        for nb in reversed(graph[node]):     # reversed keeps left-to-right order
            if nb not in visited:
                stack.append((nb, path + [nb]))
    return None

path = dfs_path(caves, 'Cave 1', 'Treasure Cave')
print("Path to treasure:", " -> ".join(path))
```

---

## Q28) Friends graph: shortest connection using BFS

```python
from collections import deque

friends = {
    'Aman': ['Riya', 'Karan'],
    'Riya': ['Aman', 'Sneha'],
    'Karan': ['Aman', 'Pooja'],
    'Sneha': ['Riya', 'Rahul'],
    'Pooja': ['Karan', 'Rahul'],
    'Rahul': ['Sneha', 'Pooja', 'Neha'],
    'Neha': ['Rahul']
}

def connection(graph, a, b):
    queue = deque([[a]])
    visited = {a}
    while queue:
        path = queue.popleft()
        if path[-1] == b:
            return path
        for nb in graph[path[-1]]:
            if nb not in visited:
                visited.add(nb)
                queue.append(path + [nb])
    return None

path = connection(friends, 'Aman', 'Neha')
print("Shortest connection:", " -> ".join(path))
print("Degrees of separation:", len(path) - 1)
```

---

## Q29) Decision Tree on Iris: accuracy, precision, recall, F1

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy :", round(accuracy_score(y_test, y_pred), 3))
print("Precision:", round(precision_score(y_test, y_pred, average='macro'), 3))
print("Recall   :", round(recall_score(y_test, y_pred, average='macro'), 3))
print("F1-score :", round(f1_score(y_test, y_pred, average='macro'), 3))
```

---

## Q30) Restaurants and delivery costs: UCS

```python
import heapq

roads = {
    'Pizza Hub':  {'Junction A': 4, 'Junction B': 2},
    'Junction A': {'Pizza Hub': 4, 'Junction C': 5, 'Customer': 10},
    'Junction B': {'Pizza Hub': 2, 'Junction A': 1, 'Junction C': 8},
    'Junction C': {'Junction A': 5, 'Junction B': 8, 'Customer': 3},
    'Customer':   {'Junction A': 10, 'Junction C': 3}
}

def ucs(graph, start, goal):
    pq = [(0, start, [start])]
    visited = set()
    while pq:
        cost, node, path = heapq.heappop(pq)
        if node == goal:
            return path, cost
        if node in visited:
            continue
        visited.add(node)
        for nb, w in graph[node].items():
            if nb not in visited:
                heapq.heappush(pq, (cost + w, nb, path + [nb]))
    return None, float('inf')

path, cost = ucs(roads, 'Pizza Hub', 'Customer')
print("Least-cost route:", " -> ".join(path))
print("Total delivery cost:", cost)
```

Output: Pizza Hub -> Junction B -> Junction A -> Junction C -> Customer, cost 11.

---

## Q31) KNN: most similar customer profile (Age, Income, Shopping Frequency)

```python
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

# [Age, Annual Income (thousands), Shopping Frequency (visits/month)]
customers = np.array([
    [22, 30, 8], [25, 35, 10], [30, 50, 6], [35, 60, 5], [40, 70, 4],
    [45, 80, 3], [28, 40, 9], [50, 90, 2], [33, 55, 7], [38, 65, 5]
])
names = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"]

scaler = StandardScaler()
scaled = scaler.fit_transform(customers)

knn = NearestNeighbors(n_neighbors=1)
knn.fit(scaled)

new_customer = np.array([[32, 52, 6]])
dist, idx = knn.kneighbors(scaler.transform(new_customer))

print("New customer profile:", new_customer[0])
print("Most similar customer:", names[idx[0][0]], customers[idx[0][0]])
print("Distance:", round(dist[0][0], 3))
```

---

## Q32) Decision Tree Regression: house price (area, bedrooms)

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# [Area (sq ft), Bedrooms, Price (lakhs)]
houses = [
    [600, 1, 35], [750, 2, 48], [900, 2, 60], [1000, 3, 75], [1200, 3, 90],
    [1400, 4, 110], [1500, 4, 120], [800, 2, 52], [1100, 3, 82], [1600, 4, 135],
    [650, 1, 38], [1300, 3, 98]
]
arr = np.array(houses)
X = arr[:, 0:2]
y = arr[:, 2]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)

model = DecisionTreeRegressor(max_depth=3, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("MAE:", round(mean_absolute_error(y_test, y_pred), 2))
print("R2 :", round(r2_score(y_test, y_pred), 2))

new_house = np.array([[1050, 3]])
print("Predicted Price:", round(model.predict(new_house)[0], 2), "lakhs")
```

---

## Q33) Vacuum cleaner agent: two rooms, detect dirt, clean or move

```python
class VacuumCleaner:
    def __init__(self):
        self.room = 1

    def clean(self):
        print("Cleaning")

    def move(self):
        print("Moving")

agent = VacuumCleaner()
agent.clean()
agent.move()
```

---

## Q34) Decision Tree: spam emails (links, suspicious words, message length)

This is the same task as Q9. See Q9 for the program. A variant that also displays the tree's rules:

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

# [Links, Suspicious Words, Message Length, Spam]
emails = np.array([
    [0, 0, 200, 0], [1, 0, 150, 0], [0, 1, 300, 0], [1, 1, 250, 0],
    [0, 0, 120, 0], [2, 0, 180, 0], [1, 0, 400, 0], [0, 1, 220, 0],
    [8, 6, 80, 1], [10, 7, 60, 1], [6, 5, 90, 1], [12, 8, 50, 1],
    [7, 4, 70, 1], [9, 6, 100, 1], [11, 9, 40, 1], [5, 5, 110, 1]
])
X, y = emails[:, :3], emails[:, 3]

model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X, y)

print(export_text(model, feature_names=["Links", "Suspicious_Words", "Message_Length"]))
new_email = np.array([[3, 2, 150]])
print("Prediction:", "SPAM" if model.predict(new_email)[0] == 1 else "NOT SPAM")
```
