#Implementing DPLL (rus - DPLL Валидатор конечных автоматов на JS)

In this question you will implement a working version of DPLL algorithm that accepts CNF statements and returns the satisfiability result. Your team can use the language of your choice, the main
condition is to produce a working, clean, well-commented solution.

(a) Implement a CNF parser that accepts a string input with a CNF encoded statement in propositional logic and converts it to a custom data structure ready for further analysis.
Example Input: (P ∨ ¬ Q) ∧ (¬ P ∨ Q ∨ R) ∧ ¬ P

(b) Implement a working DPLL algorithm following the pseudo-code you produced in questions
2(c) and 2(d). Your solution should work with data structure you implemented in the task
above, check its satisfiability, and return the result.
Example Output:
SAT
UNSAT