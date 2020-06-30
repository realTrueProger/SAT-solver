// test data
let inputString = '(P ∨ ¬ Q) ∧ (¬ P ∨ Q ∨ R) ∧ ¬ P';
let unsatTestString = 'P ∧  ¬ P';

// initialize service variables
let clauses = parseCnf(inputString);
let literals = getLiterals(clauses);
let fullFormLiterals = literals.concat(literals.map(el => '-' + el));
let decisionTable = [];

literals.forEach((literal) => {
    let obj = {};
    obj.literal = literal;
    obj.value = false;
    obj.flipped = false;

    decisionTable.push(obj);
});

console.log('clauses', clauses);
console.log('literals', literals);
console.log('fullFormLiterals', fullFormLiterals);
console.log('decisionTable', decisionTable);

console.log('DPLL result: ', dpll(clauses));

///////////////////////////////////////
/// CNF Parser

// parse cnf string to array of clauses
function parseCnf(cnf) {
    let clauses = [];

    // format input CNF
    let str = cnf
        .replace(/\s/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/¬/g, '-');

    // split clauses
    let clausesUnparsed = str.split('∧');

    // format clauses to required structure
    clausesUnparsed.forEach((clause) => {
        clauses.push(clause.split('∨'));
    });

    return clauses;
}

// get literals list
function getLiterals(clauses) {
    let literals = new Set();

    clauses.forEach((clause) => {
        clause.forEach((element) => {
            literals.add(element.replace(/-/g, ''));
        })
    });

    return Array.from(literals);
}

///////////////////////////////////////////////////
/// DPLL

// assign booleans to literals in clause
function literalAssigner(clause, literal, value) {
    return clause.map((el) => {
        if (typeof el === 'string' && el.includes(literal)) {
            return el.includes('-') ? !value : value;
        } else {
            return el ;
        }
    } );
}

// Boolean Constraint Propagation
function bcp(clauses, literal) {
    let found;
    let parsedFoundLiteral;
    let newValue;

    console.log('new bcp iteration start //////////');
    console.log(clauses, literal);

    // assign boolean values to clauses literals
    clauses = clauses.map((clause) => {
        return literalAssigner(clause, literal.name, literal.value);
    });

    console.log(clauses);

    // check for fault clauses and find new literal for truth assignment
    for (let i = 0; i < clauses.length; i++) {
        if (clauses[i].includes(true)) {
            continue;
        }

        found = clauses[i].find((el) => {
            return fullFormLiterals.includes(el);
        });

        if (found) {
            newValue = !found.includes('-');
            parsedFoundLiteral = found.replace(/-/g, '');
            console.log('found', parsedFoundLiteral);
            console.log('new value', newValue);
            break;
        }
    }

    // if found faulted clause continue bcp else return results
    if (found) {
        return bcp(clauses, {name: parsedFoundLiteral, value: newValue});
    } else {
        console.log('end bcp');

        for (let i = 0; i < clauses.length; i++) {
            if(!clauses[i].includes(true)) {
                return 'UNSAT';
            }
        }

        return 'SAT';
    }
}

// Davis–Putnam–Logemann–Loveland (DPLL) algorithm (basic version - no simplification and unit propagation)
function dpll(clauses) {
    while (decisionTable.length !== 0) {
        let bcpResult = bcp(clauses, {name: decisionTable[0].literal, value: decisionTable[0].value});
        console.log(bcpResult);
        console.log('///////////////////');

        if(bcpResult === 'SAT') {
            return 'SAT';
        }

        if (!decisionTable[0].flipped) {
            decisionTable[0].value = true;
            decisionTable[0].flipped = true;
        } else {
            decisionTable.shift();
        }
    }

    return 'UNSAT';
}