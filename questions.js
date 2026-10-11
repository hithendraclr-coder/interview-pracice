/**
 * AI Interview Coach - Question Bank
 * Contains 60 comprehensive, curated interview questions across 10 specialized categories.
 * Each entry includes: id, category, question, hint, answer, and key evaluation keywords.
 */

const interviewQuestions = [
    // ==========================================
    // 1. JAVA INTERVIEW (Questions 1 - 6)
    // ==========================================
    {
        id: 1,
        category: "Java Interview",
        question: "What is Object-Oriented Programming (OOP) and what are its four fundamental pillars in Java?",
        hint: "Think about classes, objects, and the principles that promote code reusability, modularity, and data protection.",
        answer: "Object-Oriented Programming (OOP) is a software design paradigm structured around objects—instances of classes containing state and behavior. The four pillars are: 1) Encapsulation: bundling data and methods while restricting direct access via access modifiers and getters/setters. 2) Inheritance: enabling a child class to inherit properties and methods from a parent class via 'extends'. 3) Polymorphism: allowing entities to take multiple forms through method overloading (compile-time) and method overriding (runtime). 4) Abstraction: hiding complex implementation details and showing only essential features using abstract classes and interfaces.",
        keywords: ["oop", "encapsulation", "inheritance", "polymorphism", "abstraction", "classes", "objects", "methods", "overloading", "overriding", "interface"]
    },
    {
        id: 2,
        category: "Java Interview",
        question: "Explain the difference between '==' and the '.equals()' method in Java.",
        hint: "Consider reference/memory address comparison versus logical object state/value comparison.",
        answer: "In Java, '==' is a reference comparison operator (or primitive value comparison). For object references, '==' checks whether both reference variables point to the exact same memory address on the heap. In contrast, the '.equals()' method is designed to evaluate logical value equivalence. By default in the Object class, .equals() behaves identically to '==', but classes such as String, Integer, and custom domain models override .equals() (along with .hashCode()) to compare their internal contents.",
        keywords: ["==", "equals", "reference", "memory", "heap", "logical equivalence", "override", "hashcode", "string", "primitives"]
    },
    {
        id: 3,
        category: "Java Interview",
        question: "What is the JVM (Java Virtual Machine) and how does automated Garbage Collection work?",
        hint: "Focus on bytecode execution, memory areas (Heap vs Stack), and generational garbage collection (Young/Old gen).",
        answer: "The JVM (Java Virtual Machine) provides a runtime environment that compiles and executes Java bytecode into platform-specific machine code ('Write Once, Run Anywhere'). JVM memory is partitioned into Stack (method frames, primitive local variables) and Heap (dynamic objects). Garbage Collection (GC) automatically reclaims heap memory occupied by unreferenced objects using mark-and-sweep or generational algorithms (Young Generation for newly allocated objects and Old/Tenured Generation for long-lived objects). Stop-the-world pauses are minimized using modern collectors like G1GC or ZGC.",
        keywords: ["jvm", "bytecode", "garbage collection", "heap", "stack", "mark and sweep", "generational", "young generation", "old generation", "unreferenced", "memory"]
    },
    {
        id: 4,
        category: "Java Interview",
        question: "What are the key differences between an Abstract Class and an Interface in modern Java (Java 8+)?",
        hint: "Think about multiple inheritance, state (instance variables), constructors, and default methods.",
        answer: "An Abstract Class can have constructors, instance state (fields), and a mix of abstract and implemented methods, but a class can inherit from only one abstract class (single inheritance). An Interface defines a contract; a class can implement multiple interfaces (multiple inheritance). Starting with Java 8, interfaces can contain default and static methods, and with Java 9, private methods. Abstract classes are best for shared base identity and state, while interfaces define decoupled behavior capabilities.",
        keywords: ["abstract class", "interface", "multiple inheritance", "constructors", "instance variables", "default methods", "state", "implements", "extends"]
    },
    {
        id: 5,
        category: "Java Interview",
        question: "How does HashMap work internally in Java, and how does it handle hash collisions?",
        hint: "Consider hash codes, bucket arrays, linked lists, threshold treeification (Red-Black Trees in Java 8), and load factor.",
        answer: "In Java, HashMap is an array of Node buckets. When put(key, value) is called, it computes key.hashCode(), applies a hash spread function, and calculates the array index (hash & (n-1)). If a collision occurs (two keys map to the same bucket index), entries are chained in a linked list. In Java 8+, if a bucket's chain length exceeds TREEIFY_THRESHOLD (8 entries) and capacity is at least 64, the linked list transforms into a balanced Red-Black Tree, improving collision lookup from O(n) to O(log n). It resizes when the load factor (default 0.75) is surpassed.",
        keywords: ["hashmap", "hashcode", "buckets", "collision", "linked list", "red-black tree", "treeify", "load factor", "o(1)", "o(log n)"]
    },
    {
        id: 6,
        category: "Java Interview",
        question: "What is the difference between Checked and Unchecked Exceptions in Java?",
        hint: "Examine compile-time checking, Exception hierarchy, and RuntimeException subclasses.",
        answer: "Checked exceptions are subclasses of Exception (excluding RuntimeException). They are verified at compile time, meaning the compiler mandates that developers handle them using a try-catch block or declare them in the method signature using 'throws' (e.g., IOException, SQLException). Unchecked exceptions are subclasses of RuntimeException or Error (e.g., NullPointerException, ArrayIndexOutOfBoundsException). They represent programming flaws or unrecoverable conditions and do not require mandatory compile-time handling.",
        keywords: ["checked exceptions", "unchecked exceptions", "runtimeexception", "compile time", "try-catch", "throws", "ioexception", "nullpointerexception", "error"]
    },

    // ==========================================
    // 2. PYTHON INTERVIEW (Questions 7 - 12)
    // ==========================================
    {
        id: 7,
        category: "Python Interview",
        question: "What is the Global Interpreter Lock (GIL) in Python and how does it impact multi-threading?",
        hint: "Think about CPython, CPU-bound vs I/O-bound tasks, and reference counting safety.",
        answer: "The GIL (Global Interpreter Lock) is a mutex in CPython that allows only one native thread to execute Python bytecode at a time, protecting CPython's reference-counting memory management from race conditions. Because of the GIL, multi-threading in Python cannot achieve true parallelism for CPU-bound tasks on multi-core processors. However, multi-threading is still highly effective for I/O-bound workloads (such as network calls or disk operations). For CPU-bound concurrency, developers use the 'multiprocessing' module or external libraries.",
        keywords: ["gil", "global interpreter lock", "cpython", "mutex", "multithreading", "cpu-bound", "i/o-bound", "multiprocessing", "reference counting", "parallelism"]
    },
    {
        id: 8,
        category: "Python Interview",
        question: "What are Python Decorators and how do they function under the hood?",
        hint: "Recall first-class functions, closures, and the '@decorator' syntactic sugar.",
        answer: "A decorator in Python is a design pattern and language feature used to modify or extend the behavior of a function or class without altering its source code. Because functions in Python are first-class citizens, a decorator takes a function as an argument, defines an inner wrapper function that adds preprocessing or postprocessing logic, and returns the wrapper. The '@' syntax is syntactic sugar: '@my_decorator def func(): ...' is equivalent to 'func = my_decorator(func)'. Decorators are widely used for logging, authentication, timing, and caching.",
        keywords: ["decorators", "first-class functions", "wrapper", "closures", "syntactic sugar", "arguments", "functools", "wraps", "higher-order"]
    },
    {
        id: 9,
        category: "Python Interview",
        question: "What are the core differences between Lists, Tuples, and Sets in Python?",
        hint: "Compare mutability, order preservation, duplicate allowance, and underlying hash table vs array implementations.",
        answer: "1) Lists are mutable, ordered sequences that allow duplicate items, created with square brackets []. 2) Tuples are immutable, ordered sequences that allow duplicates, created with parentheses (); they are faster and memory-efficient and can be used as dictionary keys if all elements are hashable. 3) Sets are mutable, unordered collections of unique elements (no duplicates allowed), created with curly braces {}; they are backed by hash tables, providing O(1) average time complexity for membership testing.",
        keywords: ["list", "tuple", "set", "mutable", "immutable", "ordered", "unordered", "duplicates", "hash table", "hashable", "membership"]
    },
    {
        id: 10,
        category: "Python Interview",
        question: "Explain Python Generators and the 'yield' keyword versus regular return statements.",
        hint: "Focus on lazy evaluation, memory conservation for massive streams, and iterable/iterator protocols.",
        answer: "A generator in Python is a special type of function that yields values lazily on-the-fly rather than computing and storing an entire list in memory all at once. When a function contains the 'yield' keyword, calling it returns a generator iterator. Each time next() is invoked on the generator, execution proceeds until it hits 'yield', yields the current value, and pauses its local execution state. This achieves O(1) space complexity, making generators essential for handling large files or infinite data pipelines.",
        keywords: ["generators", "yield", "lazy evaluation", "memory efficiency", "iterator", "iterable", "next()", "stream", "space complexity"]
    },
    {
        id: 11,
        category: "Python Interview",
        question: "Explain the gotcha of mutable default arguments in Python and how to avoid it.",
        hint: "Remember when function definitions are evaluated (definition time vs runtime) and how lists/dicts persist across calls.",
        answer: "In Python, default parameter expressions are evaluated once when the function definition is executed, not each time the function is called. If you specify a mutable object (such as a list 'def append_to(item, target=[])') as a default argument, that same single list instance is retained and shared across all subsequent invocations. To avoid this bug, standard idiomatic Python sets the default value to 'None' and initializes a new list inside the function body: 'if target is None: target = []'.",
        keywords: ["mutable default arguments", "definition time", "shared state", "none", "idiomatic", "function scope", "list", "bug"]
    },
    {
        id: 12,
        category: "Python Interview",
        question: "What is the difference between the '==' operator and the 'is' operator in Python?",
        hint: "Equality of values versus identity of memory address (id()).",
        answer: "In Python, '==' compares equality of values—it calls the __eq__() method to verify whether two objects hold equivalent contents. In contrast, 'is' evaluates object identity—it checks whether two variables point to the exact same object in memory, matching their memory address via id(a) == id(b). For example, two separate lists [1, 2] and [1, 2] will return True for '==' but False for 'is'.",
        keywords: ["==", "is", "identity", "equality", "memory address", "id()", "__eq__", "reference", "singleton"]
    },

    // ==========================================
    // 3. JAVASCRIPT INTERVIEW (Questions 13 - 18)
    // ==========================================
    {
        id: 13,
        category: "JavaScript Interview",
        question: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue, and Macrotask Queue.",
        hint: "Think about single-threaded execution, Promises vs setTimeout, and how asynchronous callbacks are scheduled.",
        answer: "JavaScript is single-threaded with a non-blocking asynchronous concurrency model. The Call Stack executes synchronous code frame by frame. When asynchronous operations occur (timers, fetch), they are handled by Web APIs and their callbacks are queued. The Event Loop continually inspects whether the Call Stack is empty. When empty, it first empties all microtasks (Promise resolutions, queueMicrotask, MutationObserver) before processing the next macrotask (setTimeout, setInterval, I/O). Microtasks have absolute priority over macrotasks within the loop cycle.",
        keywords: ["event loop", "call stack", "microtask queue", "macrotask queue", "promises", "settimeout", "single-threaded", "asynchronous", "web apis"]
    },
    {
        id: 14,
        category: "JavaScript Interview",
        question: "What is a Closure in JavaScript and what are its common real-world use cases?",
        hint: "Consider lexical scope, persistent access to outer variables, and data encapsulation/privacy.",
        answer: "A closure is a function that retains access to its lexical scope (outer variables) even after the outer function has finished executing and returned. This happens because the inner function holds a reference to its lexical environment. Practical applications include: 1) Data encapsulation and private variables (creating private state in module patterns), 2) Function factories and currying, 3) Event handlers and callback state retention, and 4) Utility functions like debounce, throttle, and memoization.",
        keywords: ["closure", "lexical scope", "private variables", "encapsulation", "module pattern", "currying", "callback", "memoization"]
    },
    {
        id: 15,
        category: "JavaScript Interview",
        question: "What are the key differences between 'var', 'let', and 'const' in JavaScript?",
        hint: "Compare scoping rules (function vs block), hoisting, Temporal Dead Zone (TDZ), and re-assignment.",
        answer: "1) 'var' is function-scoped (or globally scoped), hoisted and initialized to undefined, and allows re-declaration, which frequently causes subtle bugs. 2) 'let' is block-scoped, hoisted but kept uninitialized in the Temporal Dead Zone (TDZ) until evaluation, preventing access before declaration; it allows re-assignment but not re-declaration. 3) 'const' is also block-scoped and subject to the TDZ, but it cannot be reassigned after its initial assignment (though properties of objects assigned to const can still be mutated).",
        keywords: ["var", "let", "const", "block scope", "function scope", "hoisting", "temporal dead zone", "tdz", "reassignment", "re-declaration"]
    },
    {
        id: 16,
        category: "JavaScript Interview",
        question: "What are the differences between Promise.all(), Promise.allSettled(), and Promise.race()?",
        hint: "Contrast fail-fast behavior, waiting for all outcomes, and winning the race.",
        answer: "1) Promise.all() takes an iterable of promises and fulfills when all resolve, or rejects immediately with the reason of the first rejected promise ('fail-fast'). 2) Promise.allSettled() waits until every promise has either resolved or rejected, returning an array of objects describing each individual outcome ({status: 'fulfilled', value} or {status: 'rejected', reason}), making it ideal when you need all results regardless of errors. 3) Promise.race() settles (resolves or rejects) as soon as the first promise settles.",
        keywords: ["promise.all", "promise.allsettled", "promise.race", "fail-fast", "resolve", "reject", "asynchronous", "error handling"]
    },
    {
        id: 17,
        category: "JavaScript Interview",
        question: "How does Prototypal Inheritance work in JavaScript, and what is the prototype chain?",
        hint: "Focus on '__proto__', prototype objects, Object.create(), and delegation.",
        answer: "Unlike classical class-based inheritance, JavaScript uses prototypal inheritance based on object delegation. Every JavaScript object has an internal hidden link to another object called its prototype (accessible via Object.getPrototypeOf() or [[Prototype]]). When a property or method is accessed on an object, JavaScript first looks at the object itself; if not found, it traverses up the prototype chain until it either finds the property or reaches null (the end of Object.prototype). ES6 classes are syntactic sugar over this prototype delegation model.",
        keywords: ["prototypal inheritance", "prototype chain", "delegation", "__proto__", "object.prototype", "object.create", "syntactic sugar", "classes"]
    },
    {
        id: 18,
        category: "JavaScript Interview",
        question: "Explain Debouncing versus Throttling in JavaScript and give realistic use cases for each.",
        hint: "Timing techniques: waiting until activity stops versus enforcing an execution rate limit.",
        answer: "Both debouncing and throttling limit the execution rate of expensive functions. Debouncing ensures a function runs only after a specified delay has elapsed since the LAST time it was triggered (e.g., auto-complete search inputs, window resize handlers, or auto-saving drafts). Throttling enforces a maximum frequency of execution, ensuring the function runs at most once every specified time interval regardless of how frequently it is fired (e.g., infinite scroll loaders, gaming mouse movements, or scroll-based animations).",
        keywords: ["debouncing", "throttling", "rate limit", "delay", "search input", "scroll", "resize", "event listener", "timer"]
    },

    // ==========================================
    // 4. SQL INTERVIEW (Questions 19 - 24)
    // ==========================================
    {
        id: 19,
        category: "SQL Interview",
        question: "What is the difference between the WHERE clause and the HAVING clause in SQL?",
        hint: "Filter before grouping vs filter after aggregate calculations.",
        answer: "The WHERE clause is applied to filter individual rows BEFORE any grouping (GROUP BY) or aggregation occurs. It cannot filter on aggregate functions (like COUNT(), SUM(), AVG()). The HAVING clause is applied AFTER the GROUP BY operation to filter aggregated summary rows based on group-level conditions. Example: 'SELECT department, AVG(salary) FROM employees WHERE status = 'Active' GROUP BY department HAVING AVG(salary) > 80000;'.",
        keywords: ["where", "having", "group by", "aggregates", "filtering", "rows", "summary", "count", "avg", "sum"]
    },
    {
        id: 20,
        category: "SQL Interview",
        question: "Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
        hint: "Matching records, unmatched left/right table rows, and NULL padding.",
        answer: "1) INNER JOIN returns only the rows that have matching values in both tables based on the join predicate. 2) LEFT JOIN (LEFT OUTER JOIN) returns all records from the left table, plus matched records from the right table; unmatched right table columns are populated with NULL. 3) RIGHT JOIN returns all rows from the right table and matching rows from the left table. 4) FULL OUTER JOIN returns all rows when there is a match in either table, filling missing matches on either side with NULL.",
        keywords: ["inner join", "left join", "right join", "full outer join", "null", "matching records", "tables", "predicate", "keys"]
    },
    {
        id: 21,
        category: "SQL Interview",
        question: "What are Indexes in SQL, how do B-Trees optimize queries, and what is their overhead?",
        hint: "Fast lookups vs slower write operations (INSERT/UPDATE/DELETE) and disk storage.",
        answer: "An index is a database data structure (typically a balanced B-Tree or B+ Tree) that enables rapid retrieval of rows without scanning every table block (full table scan). By organizing keys in sorted order with pointers to actual rows, lookups and range scans achieve O(log n) time complexity. However, indexes carry trade-offs: they require extra disk storage and add write latency because indexes must be updated whenever INSERT, UPDATE, or DELETE operations occur.",
        keywords: ["indexes", "b-tree", "b+ tree", "full table scan", "o(log n)", "lookup", "insert", "update", "write overhead", "storage"]
    },
    {
        id: 22,
        category: "SQL Interview",
        question: "What are the ACID properties in relational database management systems?",
        hint: "Atomicity, Consistency, Isolation, and Durability guarantees for reliable transactions.",
        answer: "ACID guarantees transactional reliability in databases: 1) Atomicity: the 'all-or-nothing' principle; if any step fails, the entire transaction rolls back. 2) Consistency: transactions transition the database from one valid state to another, upholding all schema rules and constraints. 3) Isolation: concurrent transactions execute without interfering with each other (governed by isolation levels like Read Committed or Serializable). 4) Durability: once committed, changes survive system crashes or power losses through write-ahead logs.",
        keywords: ["acid", "atomicity", "consistency", "isolation", "durability", "transaction", "rollback", "commit", "concurrency", "wal"]
    },
    {
        id: 23,
        category: "SQL Interview",
        question: "What is Database Normalization and what are 1NF, 2NF, and 3NF?",
        hint: "Eliminating data redundancy, update anomalies, and organizing tables logically.",
        answer: "Database normalization organizes tables to minimize data redundancy and prevent insertion, update, and deletion anomalies. 1) 1NF (First Normal Form): requires atomic (indivisible) column values, unique row identifiers, and no repeating groups. 2) 2NF: must be in 1NF and eliminate partial dependencies (all non-key attributes must depend fully on the primary key, relevant for composite keys). 3) 3NF: must be in 2NF and eliminate transitive dependencies (non-key attributes must not depend on other non-key attributes).",
        keywords: ["normalization", "1nf", "2nf", "3nf", "redundancy", "atomic", "partial dependency", "transitive dependency", "primary key", "anomalies"]
    },
    {
        id: 24,
        category: "SQL Interview",
        question: "What is the difference between DELETE, TRUNCATE, and DROP commands in SQL?",
        hint: "DML vs DDL, WHERE clause support, rollback ability, and reset of identity counters.",
        answer: "1) DELETE is a DML command that removes specific rows matching a WHERE clause; it logs each deleted row individually, fires triggers, can be rolled back in a transaction, and does not reset identity seeds. 2) TRUNCATE is a DDL command that deallocates all data pages in a table; it operates much faster by minimally logging page deallocations, resets auto-increment IDs, does not fire row triggers, and cannot filter with WHERE. 3) DROP is a DDL command that completely deletes the table definition, data, triggers, and permissions from the database catalog.",
        keywords: ["delete", "truncate", "drop", "dml", "ddl", "where", "rollback", "transaction", "auto-increment", "triggers", "deallocate"]
    },

    // ==========================================
    // 5. DATA STRUCTURES & ALGORITHMS (Questions 25 - 30)
    // ==========================================
    {
        id: 25,
        category: "Data Structures and Algorithms",
        question: "Compare an Array and a Singly Linked List in terms of memory layout and time complexity.",
        hint: "Contiguous vs non-contiguous memory, index access O(1) vs traversal O(n), and insertions at the head.",
        answer: "An Array stores elements in contiguous memory blocks, enabling O(1) random index access via memory offsets, but insertions and deletions in the middle or beginning require shifting elements (O(n)). Arrays also have fixed size or reallocation overhead. A Linked List stores nodes scattered across heap memory connected via pointers. It does not support random access (retrieval requires O(n) traversal), but inserting or deleting a node at known reference locations (e.g., at the head) takes O(1) time without element shifting. Linked lists also consume additional memory for pointer storage.",
        keywords: ["array", "linked list", "contiguous memory", "pointers", "random access", "o(1)", "o(n)", "insertion", "deletion", "cache locality"]
    },
    {
        id: 26,
        category: "Data Structures and Algorithms",
        question: "What is a Binary Search Tree (BST) and what are its best, average, and worst-case time complexities?",
        hint: "Left subtree smaller, right subtree larger, balanced trees vs skewed/degenerate trees.",
        answer: "A Binary Search Tree (BST) is a hierarchical node-based data structure where each node has at most two children. The left subtree contains only nodes with keys strictly less than the node's key, and the right subtree contains keys strictly greater. In average and best cases (balanced tree), search, insertion, and deletion run in O(log n) time. However, if keys are inserted in sorted order without balancing, the tree degenerates into a linear linked list (skewed tree), causing worst-case time complexity to degrade to O(n). Self-balancing trees (AVL or Red-Black trees) prevent this degradation.",
        keywords: ["bst", "binary search tree", "o(log n)", "o(n)", "skewed tree", "balanced", "avl", "red-black tree", "traversal", "search"]
    },
    {
        id: 27,
        category: "Data Structures and Algorithms",
        question: "Explain how QuickSort works, its time complexity, and how to avoid its worst-case scenario.",
        hint: "Divide and conquer, pivot selection, partitioning, and randomized pivots.",
        answer: "QuickSort is a divide-and-conquer sorting algorithm. It selects a 'pivot' element, partitions the array such that all elements smaller than the pivot are placed before it and larger elements after it, and recursively sorts the sub-arrays. On average, QuickSort achieves O(n log n) time with excellent cache locality. The worst-case complexity is O(n^2), occurring when the chosen pivot is consistently the smallest or largest element (e.g., picking the first element of an already sorted array). This worst case is avoided by using randomized pivot selection or the median-of-three technique.",
        keywords: ["quicksort", "pivot", "partition", "divide and conquer", "o(n log n)", "o(n^2)", "median of three", "randomized pivot", "in-place"]
    },
    {
        id: 28,
        category: "Data Structures and Algorithms",
        question: "Explain Breadth-First Search (BFS) versus Depth-First Search (DFS) for graph traversal.",
        hint: "Queue vs Stack/Recursion, finding shortest path in unweighted graphs vs exploring complete paths.",
        answer: "BFS (Breadth-First Search) explores a graph level by level, visiting all immediate neighbors of a node before moving deeper. It utilizes a Queue (FIFO) and is optimal for finding the shortest path in unweighted graphs. DFS (Depth-First Search) explores as deep as possible along each branch before backtracking. It utilizes a Stack (LIFO) or system call recursion. DFS is ideal for topological sorting, cycle detection, maze solving, and connected component analysis. Both have O(V + E) time complexity.",
        keywords: ["bfs", "dfs", "queue", "stack", "recursion", "shortest path", "topological sort", "cycle detection", "graph", "o(v + e)"]
    },
    {
        id: 29,
        category: "Data Structures and Algorithms",
        question: "What is Dynamic Programming (DP) and how do Memoization and Tabulation differ?",
        hint: "Overlapping subproblems, optimal substructure, top-down vs bottom-up.",
        answer: "Dynamic Programming solves complex problems by breaking them into overlapping subproblems and optimal substructures, storing solutions to subproblems to avoid redundant recomputations. 1) Memoization is a Top-Down approach: it uses standard recursion but caches the results of function calls in a table/map before returning. 2) Tabulation is a Bottom-Up approach: it builds an iterative table starting from base cases up to the desired target, avoiding recursive call stack overhead. Both transform exponential O(2^n) algorithms into polynomial time.",
        keywords: ["dynamic programming", "memoization", "tabulation", "top-down", "bottom-up", "overlapping subproblems", "optimal substructure", "caching"]
    },
    {
        id: 30,
        category: "Data Structures and Algorithms",
        question: "How do Hash Tables achieve O(1) average lookup and how are collisions resolved?",
        hint: "Hash functions, chaining with linked lists, open addressing with linear/quadratic probing.",
        answer: "A Hash Table maps keys to bucket indices using a hash function, computing index = hash(key) % capacity, enabling O(1) average time complexity for insert, search, and delete operations. When different keys yield the same index (collision), two main strategies resolve it: 1) Separate Chaining: each bucket holds a linked list (or balanced tree) of colliding entries. 2) Open Addressing: all entries reside directly in the table array; when collisions occur, probing algorithms (Linear Probing, Quadratic Probing, or Double Hashing) search for the next available slot.",
        keywords: ["hash table", "hash function", "o(1)", "collision resolution", "separate chaining", "open addressing", "linear probing", "load factor"]
    },

    // ==========================================
    // 6. HTML AND CSS (Questions 31 - 36)
    // ==========================================
    {
        id: 31,
        category: "HTML and CSS",
        question: "Explain the CSS Box Model and the difference between 'content-box' and 'border-box'.",
        hint: "Content, padding, border, margin, and how element total width is calculated.",
        answer: "The CSS Box Model consists of: content, padding, border, and margin. Under the default 'box-sizing: content-box', setting width applies solely to the inner content area; adding padding and borders expands the rendered element's total width (total = width + padding + border). Under 'box-sizing: border-box', the specified width includes content, padding, and border. Padding and borders push inward, making layout dimensions predictable and responsive, which is why universal '* { box-sizing: border-box; }' is an industry standard.",
        keywords: ["box model", "content-box", "border-box", "padding", "border", "margin", "width", "layout", "box-sizing"]
    },
    {
        id: 32,
        category: "HTML and CSS",
        question: "What is Semantic HTML and why is it crucial for modern web applications?",
        hint: "Tags that carry meaning (<article>, <nav>, <header>) versus generic <div> and <span>, a11y, and SEO.",
        answer: "Semantic HTML uses tags that convey the meaning and purpose of content to browsers, assistive technologies, and search engine crawlers (e.g., <header>, <nav>, <main>, <article>, <section>, <footer>, <button> rather than arbitrary <div> tags). It is essential because: 1) Accessibility (a11y): Screen readers navigate landmark elements and announce role landmarks properly. 2) SEO: Search engines index the semantic hierarchy and prioritize content accurately. 3) Maintainability and readability for engineering teams.",
        keywords: ["semantic html", "accessibility", "a11y", "seo", "screen readers", "nav", "article", "header", "landmarks", "div soup"]
    },
    {
        id: 33,
        category: "HTML and CSS",
        question: "What are the core differences between CSS Flexbox and CSS Grid and when should you use each?",
        hint: "One-dimensional layout (row OR column) versus two-dimensional layout (rows AND columns).",
        answer: "CSS Flexbox is a one-dimensional layout system designed for distributing space and aligning items along either a single row OR a single column (e.g., navigation bars, button groups, centered cards). CSS Grid is a two-dimensional layout system designed for managing rows AND columns simultaneously (e.g., full-page dashboards, photo galleries, complex card matrices). In modern architecture, Grid controls overall page structure while Flexbox manages component-level alignment.",
        keywords: ["flexbox", "grid", "one-dimensional", "two-dimensional", "rows", "columns", "alignment", "layout", "responsive"]
    },
    {
        id: 34,
        category: "HTML and CSS",
        question: "How does CSS Specificity work and how is the cascade order resolved?",
        hint: "Inline styles, IDs, classes/attributes/pseudo-classes, and elements/pseudo-elements.",
        answer: "CSS Specificity is a weight score that determines which style declaration applies when multiple rules target the same element. It is calculated in a 4-tier hierarchy: 1) Inline styles (1,0,0,0), 2) ID selectors (0,1,0,0), 3) Classes, attributes, and pseudo-classes (0,0,1,0), 4) Elements and pseudo-elements (0,0,0,1). Universal selector (*) has no specificity (0,0,0,0). '!important' overrides normal specificity. When specificity scores tie, the rule declared latest in the stylesheet wins.",
        keywords: ["css specificity", "cascade", "inline styles", "id selector", "class selector", "elements", "!important", "specificity score"]
    },
    {
        id: 35,
        category: "HTML and CSS",
        question: "Explain the CSS position property values: static, relative, absolute, fixed, and sticky.",
        hint: "Normal document flow, offset against parent, viewport pinning, and scroll thresholds.",
        answer: "1) 'static': default document flow; top/right/bottom/left/z-index have no effect. 2) 'relative': remains in normal document flow, but can be visually offset relative to its original position without affecting surrounding elements. 3) 'absolute': removed from normal flow, positioned relative to its closest non-static ancestor. 4) 'fixed': removed from flow, anchored relative to the browser viewport, remaining visible during scroll. 5) 'sticky': hybrid that toggles between relative and fixed depending on scroll offset thresholds.",
        keywords: ["position", "static", "relative", "absolute", "fixed", "sticky", "document flow", "viewport", "ancestor", "offset"]
    },
    {
        id: 36,
        category: "HTML and CSS",
        question: "Explain the Critical Rendering Path: how browsers turn HTML and CSS into rendered pixels.",
        hint: "DOM tree, CSSOM tree, Render tree, Layout (Reflow), and Paint.",
        answer: "The Critical Rendering Path is the sequence of steps a browser takes to render a web page: 1) Parsing HTML to construct the Document Object Model (DOM) tree. 2) Parsing CSS to construct the CSS Object Model (CSSOM) tree. 3) Combining DOM and CSSOM to build the Render Tree (excluding hidden elements like display: none). 4) Layout (Reflow): computing exact physical coordinates and geometry for each render node. 5) Painting (Repaint): rasterizing pixels, colors, borders, and shadows to the screen buffer. Compositing then handles GPU layers.",
        keywords: ["critical rendering path", "dom", "cssom", "render tree", "layout", "reflow", "paint", "repaint", "rasterization"]
    },

    // ==========================================
    // 7. COMPUTER NETWORKS (Questions 37 - 42)
    // ==========================================
    {
        id: 37,
        category: "Computer Networks",
        question: "What happens step-by-step when you type a URL into a browser address bar and press Enter?",
        hint: "DNS lookup, TCP 3-way handshake, TLS handshake, HTTP request/response, and page rendering.",
        answer: "1) Browser parses the URL and checks DNS cache (browser, OS, router, ISP). If uncached, it queries recursive and authoritative DNS servers to resolve the domain to an IP address. 2) Browser initiates a TCP connection via the Three-Way Handshake (SYN, SYN-ACK, ACK). 3) For HTTPS, an SSL/TLS handshake negotiates cipher suites and exchanges cryptographic keys. 4) Browser sends an HTTP/HTTPS GET request. 5) Server processes the request and returns an HTTP response with headers and HTML payload. 6) Browser parses HTML, fetches secondary assets (CSS/JS/images), builds DOM/CSSOM, and paints pixels.",
        keywords: ["url", "dns resolution", "ip address", "tcp handshake", "tls handshake", "http get", "server response", "dom", "rendering"]
    },
    {
        id: 38,
        category: "Computer Networks",
        question: "What are the primary differences between TCP and UDP, and what are their typical use cases?",
        hint: "Connection-oriented vs connectionless, reliability vs low latency speed, flow control vs no guarantees.",
        answer: "TCP (Transmission Control Protocol) is connection-oriented, reliable, and byte-stream oriented. It guarantees packet delivery, order, and integrity using sequence numbers, acknowledgments, retransmissions, and flow/congestion control mechanisms (used in web browsing HTTP, email SMTP, file transfer FTP). UDP (User Datagram Protocol) is connectionless, lightweight, and unreliable. It transmits datagrams without handshakes or delivery guarantees, offering minimal latency and overhead (used in video streaming, VoIP, DNS lookups, and multiplayer gaming).",
        keywords: ["tcp", "udp", "connection-oriented", "connectionless", "reliability", "packet order", "flow control", "latency", "streaming", "gaming"]
    },
    {
        id: 39,
        category: "Computer Networks",
        question: "Explain the TCP Three-Way Handshake and the TCP Four-Way Teardown.",
        hint: "SYN, SYN-ACK, ACK for connection establishment; FIN and ACK for orderly termination.",
        answer: "The TCP 3-Way Handshake establishes a reliable connection: 1) Client sends SYN with an Initial Sequence Number (ISN). 2) Server responds with SYN-ACK, acknowledging client's ISN and presenting its own ISN. 3) Client returns ACK confirming receipt. For connection teardown (4-Way Termination): 1) Initiating party sends FIN. 2) Receiving party sends ACK (entering close-wait). 3) Once finished sending pending data, receiver sends its own FIN. 4) Initiator responds with ACK and enters TIME_WAIT before fully closing.",
        keywords: ["tcp 3-way handshake", "syn", "syn-ack", "ack", "fin", "connection teardown", "sequence numbers", "time_wait"]
    },
    {
        id: 40,
        category: "Computer Networks",
        question: "What is the difference between HTTP and HTTPS, and how does the SSL/TLS Handshake work?",
        hint: "Plaintext vs encrypted traffic, port 80 vs 443, symmetric vs asymmetric encryption, and digital certificates.",
        answer: "HTTP transfers plaintext data over port 80, vulnerable to eavesdropping and man-in-the-middle attacks. HTTPS encrypts traffic over port 443 using SSL/TLS, ensuring confidentiality, integrity, and server authentication. During the TLS handshake: 1) Client sends 'ClientHello' with supported TLS versions and cipher suites. 2) Server replies with 'ServerHello' and its digital certificate (signed by a trusted CA). 3) Client verifies the certificate and uses asymmetric cryptography to securely negotiate a shared symmetric session key. 4) Both sides switch to fast symmetric encryption for all application payloads.",
        keywords: ["http", "https", "ssl", "tls handshake", "encryption", "certificate", "ca", "symmetric encryption", "asymmetric encryption", "port 443"]
    },
    {
        id: 41,
        category: "Computer Networks",
        question: "What is DNS (Domain Name System) and how does hierarchical resolution work?",
        hint: "IP address translation, recursive resolver, root servers, TLD servers, and authoritative nameservers.",
        answer: "DNS is the internet's decentralized phonebook, translating human-readable domain names (e.g., example.com) into machine IP addresses. When resolving a domain: 1) Client asks a Recursive Resolver (usually ISP or public 8.8.8.8). 2) Resolver queries a Root Nameserver, which directs it to the Top-Level Domain (TLD) nameserver (.com, .org). 3) TLD server directs the resolver to the domain's Authoritative Nameserver. 4) Authoritative server provides the actual IP address (A/AAAA record), which the resolver caches and returns to the client.",
        keywords: ["dns", "recursive resolver", "root server", "tld server", "authoritative nameserver", "ip address", "a record", "caching"]
    },
    {
        id: 42,
        category: "Computer Networks",
        question: "Compare the 7-Layer OSI Model with the 4-Layer TCP/IP Model.",
        hint: "Physical, Data Link, Network, Transport, Session, Presentation, Application vs Network Access, Internet, Transport, Application.",
        answer: "The OSI model is a 7-layer theoretical conceptual framework: Physical (cables, bits), Data Link (frames, MAC addresses, switches), Network (packets, IP routing), Transport (segments, TCP/UDP), Session (connection management), Presentation (formatting, encryption), and Application (HTTP, SMTP). The TCP/IP model is the pragmatic 4-layer architecture of the actual internet: Network Interface (OSI 1 & 2), Internet (OSI 3 - IP), Transport (OSI 4 - TCP/UDP), and Application (OSI 5, 6, & 7 combined - HTTP, DNS, SSH).",
        keywords: ["osi model", "tcp/ip model", "application layer", "transport layer", "network layer", "data link", "physical layer", "packets", "routing"]
    },

    // ==========================================
    // 8. OPERATING SYSTEMS (Questions 43 - 48)
    // ==========================================
    {
        id: 43,
        category: "Operating Systems",
        question: "What is the difference between a Process and a Thread, and how do they share memory?",
        hint: "Independent address space vs lightweight execution unit sharing heap and code segment.",
        answer: "A Process is an executing instance of a computer program with its own isolated address space, heap, stack, file descriptors, and system resources; context switching between processes is relatively expensive due to page table swaps. A Thread is a lightweight dispatchable execution unit within a parent process. Multiple threads within the same process share the process's code section, data segment, and heap memory, but each thread possesses its own private program counter, registers, and call stack. Threads offer fast communication but require synchronization locks to prevent race conditions.",
        keywords: ["process", "thread", "address space", "heap", "stack", "context switch", "shared memory", "isolation", "synchronization", "concurrency"]
    },
    {
        id: 44,
        category: "Operating Systems",
        question: "What is a Deadlock and what are the four Coffman Conditions necessary for a deadlock to occur?",
        hint: "Mutual exclusion, hold and wait, no preemption, and circular wait.",
        answer: "A Deadlock is a state where a set of processes are permanently blocked because each process holds a resource and waits for another resource held by another process in the set. For a deadlock to arise, all four Coffman conditions must hold simultaneously: 1) Mutual Exclusion: at least one non-shareable resource. 2) Hold and Wait: processes hold resources while requesting new ones. 3) No Preemption: resources cannot be forcibly seized; only released voluntarily. 4) Circular Wait: a closed chain of processes exists where P0 waits for P1, and Pn waits for P0. Breaking any single condition prevents deadlocks.",
        keywords: ["deadlock", "coffman conditions", "mutual exclusion", "hold and wait", "no preemption", "circular wait", "resource allocation", "concurrency"]
    },
    {
        id: 45,
        category: "Operating Systems",
        question: "Explain Virtual Memory, Paging, and Page Faults in modern operating systems.",
        hint: "Hardware translation MMU, page tables, physical frames, swap space on disk.",
        answer: "Virtual Memory gives each process the illusion of a massive, contiguous memory space while mapping virtual addresses to non-contiguous physical RAM. In Paging, virtual memory is partitioned into fixed-size chunks called Pages (typically 4KB), and physical RAM into Frames. The CPU Memory Management Unit (MMU) uses Page Tables and TLB cache to translate addresses. A Page Fault occurs when a program accesses a virtual page not currently resident in physical RAM. The OS interrupts, reads the page from disk/swap into an available RAM frame, updates the page table, and resumes execution.",
        keywords: ["virtual memory", "paging", "page fault", "mmu", "page table", "frames", "ram", "swap space", "tlb"]
    },
    {
        id: 46,
        category: "Operating Systems",
        question: "What is CPU Scheduling and what is the difference between Preemptive and Non-Preemptive scheduling?",
        hint: "Timer interrupts, context switching, Round Robin vs First-Come-First-Served (FCFS).",
        answer: "CPU Scheduling determines which ready-queue process is allocated the CPU core. In Preemptive Scheduling, the operating system can forcibly interrupt an actively running process and move it back to the ready queue (e.g., via timer interrupts in Round Robin, Shortest Remaining Time First, or priority preemption), ensuring responsive multitasking. In Non-Preemptive Scheduling, once a process gets CPU control, it runs unimpeded until it either terminates voluntarily or blocks for I/O (e.g., First-Come-First-Served FCFS or non-preemptive Shortest Job First).",
        keywords: ["cpu scheduling", "preemptive", "non-preemptive", "round robin", "fcfs", "context switch", "timer interrupt", "ready queue"]
    },
    {
        id: 47,
        category: "Operating Systems",
        question: "What is Thrashing in an operating system and how can it be detected and prevented?",
        hint: "Excessive swapping/paging between RAM and disk, CPU utilization drop, working set model.",
        answer: "Thrashing occurs when the operating system spends more time swapping pages between physical RAM and disk than executing actual instructions. It happens when active processes demand more collective memory than available physical RAM frames. As page fault rates skyrocket, the CPU scheduler mistakenly assumes the CPU is underutilized and introduces more processes, compounding the problem. Thrashing is resolved using the Working Set Model (allocating each process enough frames to hold its working set) or by suspending low-priority processes to free memory.",
        keywords: ["thrashing", "page fault", "swapping", "disk i/o", "working set model", "ram", "cpu utilization", "page replacement"]
    },
    {
        id: 48,
        category: "Operating Systems",
        question: "What is a System Call and how does CPU Mode Switching (User Mode vs Kernel Mode) ensure security?",
        hint: "Privilege rings, hardware protection, traps, and safe hardware abstractions.",
        answer: "Modern CPUs implement hardware protection rings: User Mode (Ring 3, unprivileged) where user applications run without direct hardware access, and Kernel Mode (Ring 0, privileged) where the OS kernel executes with unrestricted hardware access. A System Call (syscall) is the programmatic interface that allows user programs to safely request kernel services (e.g., read(), write(), fork()). When executed, a software interrupt or trap switches CPU execution from User Mode to Kernel Mode, executes the validated kernel routine, and switches back to User Mode.",
        keywords: ["system call", "user mode", "kernel mode", "privilege rings", "trap", "context switch", "security", "hardware abstraction"]
    },

    // ==========================================
    // 9. DBMS (Questions 49 - 54)
    // ==========================================
    {
        id: 49,
        category: "DBMS",
        question: "What are the key architectural differences between SQL (Relational) and NoSQL databases?",
        hint: "Structured tables vs document/key-value/graph models, fixed schema vs dynamic schema, vertical vs horizontal scaling.",
        answer: "SQL databases (e.g., PostgreSQL, MySQL) are relational, structured systems with strict, predefined schemas, emphasizing ACID compliance and complex multi-table JOINs; they typically scale vertically by upgrading server hardware. NoSQL databases (e.g., MongoDB, Redis, Cassandra) are non-relational, distributed systems supporting dynamic schemas across document, key-value, column-family, or graph models. They prioritize horizontal scaling across distributed commodity clusters and offer flexible consistency models (BASE) suitable for massive, rapidly evolving unstructured data.",
        keywords: ["sql", "nosql", "relational", "schema", "acid", "horizontal scaling", "vertical scaling", "mongodb", "postgresql", "base"]
    },
    {
        id: 50,
        category: "DBMS",
        question: "Explain Concurrency Control and the Two-Phase Locking (2PL) protocol in DBMS.",
        hint: "Serializability, growing phase (acquiring locks) vs shrinking phase (releasing locks).",
        answer: "Concurrency Control ensures database transactions execute concurrently without violating consistency or causing anomalies (like dirty reads or lost updates). Two-Phase Locking (2PL) is a concurrency control protocol that guarantees serializability through two distinct lock phases: 1) Growing Phase: a transaction may acquire new locks (shared or exclusive) but cannot release any lock. 2) Shrinking Phase: once the first lock is released, the transaction can only release existing locks and cannot acquire new locks. Strict 2PL holds all exclusive locks until commit or abort to prevent cascading rollbacks.",
        keywords: ["concurrency control", "two-phase locking", "2pl", "growing phase", "shrinking phase", "serializability", "shared lock", "exclusive lock", "cascading rollback"]
    },
    {
        id: 51,
        category: "DBMS",
        question: "What is Write-Ahead Logging (WAL) and how does it guarantee durability and crash recovery?",
        hint: "Log before data flush, redo/undo logging, checkpoints, and ACID durability.",
        answer: "Write-Ahead Logging (WAL) is a recovery technique where all modifications (inserts, updates, deletes) are appended to a persistent sequential log file on disk BEFORE the actual database table pages are written to disk. Because sequential log writes are extremely fast compared to random table page flushes, WAL provides high write performance while guaranteeing ACID Durability. In the event of an unexpected crash or power failure, the database engine inspects the WAL during restart to REDO committed transactions and UNDO uncommitted transactions.",
        keywords: ["write-ahead logging", "wal", "durability", "crash recovery", "redo", "undo", "sequential log", "checkpoints", "acid"]
    },
    {
        id: 52,
        category: "DBMS",
        question: "What is the difference between a Clustered Index and a Non-Clustered Index?",
        hint: "Physical data sorting order on disk vs separate lookup index with pointers.",
        answer: "A Clustered Index dictates the physical storage order of rows in the table; therefore, a table can have only ONE clustered index (typically on the Primary Key). The leaf nodes of a clustered index contain the actual data rows. A Non-Clustered Index is a separate secondary structure whose leaf nodes contain key values and row pointers (or clustered index keys) referencing the actual physical row data. A table can have multiple non-clustered indexes to optimize various query filters.",
        keywords: ["clustered index", "non-clustered index", "physical storage", "primary key", "leaf nodes", "row pointers", "b-tree"]
    },
    {
        id: 53,
        category: "DBMS",
        question: "Explain Database Sharding versus Partitioning in high-scale systems.",
        hint: "Horizontal splitting across multiple servers vs splitting within a single database instance.",
        answer: "Partitioning divides a large table into smaller, more manageable subsets (e.g., by range, hash, or list) within a single database server instance; it improves maintenance and query performance via partition pruning. Sharding is a form of horizontal scaling that splits database data across multiple separate database servers/nodes. Each shard holds a distinct partition of the data based on a shard key. Sharding allows massive throughput and storage expansion beyond the limits of a single machine, though it introduces complexity for cross-shard joins and distributed transactions.",
        keywords: ["sharding", "partitioning", "horizontal scaling", "shard key", "distributed database", "partition pruning", "cross-shard joins"]
    },
    {
        id: 54,
        category: "DBMS",
        question: "What is the CAP Theorem and how does it influence distributed database design?",
        hint: "Consistency, Availability, and Partition Tolerance—pick two in network splits.",
        answer: "The CAP Theorem states that in any distributed data store, you can simultaneously guarantee at most two of the following three properties in the presence of network failures: 1) Consistency (C): every read receives the most recent write or an error. 2) Availability (A): every non-failing node returns a non-error response, but without guarantee it's the latest write. 3) Partition Tolerance (P): system continues operating despite dropped or delayed network messages between nodes. Because network partitions (P) are unavoidable in distributed systems, architectures choose either CP (e.g., HBase, Spanner) or AP (e.g., Cassandra, DynamoDB).",
        keywords: ["cap theorem", "consistency", "availability", "partition tolerance", "network partitions", "distributed systems", "cp", "ap", "eventual consistency"]
    },

    // ==========================================
    // 10. HR INTERVIEW (Questions 55 - 60)
    // ==========================================
    {
        id: 55,
        category: "HR Interview",
        question: "'Tell me about yourself' — How do you structure an impactful 90-second professional answer?",
        hint: "Use the Present-Past-Future formula: current role, key relevant achievements, and alignment with this opportunity.",
        answer: "A strong response follows the Present-Past-Future structure: 1) Present: Start with your current title, specialty, and recent core contributions (e.g., 'I am a software engineer specializing in scalable full-stack web applications and cloud architectures'). 2) Past: Highlight 1-2 major achievements, technical challenges conquered, or educational milestones that showcase your engineering rigor and team impact. 3) Future: Articulate clearly why this specific role and organization match your career trajectory and how your skills will solve their immediate technical goals.",
        keywords: ["present past future", "impact", "achievements", "career trajectory", "value proposition", "experience", "role alignment", "introduction"]
    },
    {
        id: 56,
        category: "HR Interview",
        question: "'What is your greatest weakness, and how are you actively improving it?'",
        hint: "Pick a genuine professional development area (not a cliché perfectionism disguise) and demonstrate actionable steps taken.",
        answer: "Select a genuine, non-critical technical or professional skill, explain how you recognized it, and show concrete self-improvement. For example: 'Earlier in my career, I found it challenging to delegate tasks because I wanted to ensure every implementation detail matched my vision. I recognized this created bottlenecks during tight sprints. To address this, I started documenting clear acceptance criteria, establishing trust in team pair programming, and using milestone check-ins. This has significantly enhanced our team velocity and helped junior engineers grow.'",
        keywords: ["weakness", "self-awareness", "actionable improvement", "growth mindset", "delegation", "constructive", "concrete steps"]
    },
    {
        id: 57,
        category: "HR Interview",
        question: "Describe a situation where you had a conflict with a colleague and how you resolved it (STAR Method).",
        hint: "Situation, Task, Action, Result. Focus on professional objective disagreement, empathy, and positive team outcome.",
        answer: "Using the STAR method: 1) Situation: During a sprint, a teammate and I strongly disagreed on database schema design—they preferred an unstructured document store while I advocated for a relational PostgreSQL schema. 2) Task: We needed to deliver a reliable data layer within three days without stalling the sprint. 3) Action: Rather than debating theoretically, I scheduled a focused 30-minute sync. We wrote down our user query patterns, evaluated read vs write ratios, and benchmarked relational constraints against our strict consistency requirements. We both agreed a relational model with JSONB columns met both needs. 4) Result: We completed the feature on schedule with zero production schema migrations needed, strengthening our working relationship.",
        keywords: ["star method", "situation", "task", "action", "result", "conflict resolution", "empathy", "communication", "collaboration", "compromise"]
    },
    {
        id: 58,
        category: "HR Interview",
        question: "'Why do you want to work for our company specifically?'",
        hint: "Mention specific company products, mission, engineering culture, or recent technical innovations.",
        answer: "Demonstrate tailored research and cultural alignment. Structure your response into: 1) Product & Mission: Express enthusiasm for their specific product value proposition and user impact. 2) Engineering Culture: Reference their technical initiatives (e.g., their tech blog, open source contributions, or scalability challenges). 3) Mutual Value: Connect your technical capabilities directly to how you will help their team solve upcoming engineering roadmap milestones.",
        keywords: ["company research", "mission", "engineering culture", "product value", "alignment", "contribution", "enthusiasm"]
    },
    {
        id: 59,
        category: "HR Interview",
        question: "'Where do you see yourself in five years professionally?'",
        hint: "Show realistic ambition, technical mastery, mentorship, and progressive leadership.",
        answer: "Articulate a realistic trajectory emphasizing continuous technical depth, business understanding, and leadership: 'In five years, I aim to have advanced from a strong feature contributor to a technical lead or staff engineer who architects resilient distributed systems. I want to be recognized as a domain subject matter expert, mentor junior and mid-level engineers, and actively participate in system architecture decisions that bridge business strategy with high-quality software engineering.'",
        keywords: ["five years", "technical leadership", "architecture", "mentorship", "growth", "career goals", "subject matter expert", "ambition"]
    },
    {
        id: 60,
        category: "HR Interview",
        question: "'Do you have any questions for us at the end of this interview?' — How do you demonstrate engagement?",
        hint: "Ask thoughtful questions about engineering culture, challenges, success metrics, and team dynamics.",
        answer: "Always ask 2-3 thoughtful questions that reflect genuine curiosity and engagement: 1) 'What does the day-to-day release and code review cycle look like for this team?' 2) 'What is the most significant technical or scalability hurdle your engineering team aims to tackle in the next 6-12 months?' 3) 'What qualities differentiate an engineer who simply performs well in this role from someone who truly thrives and makes a lasting impact?'",
        keywords: ["questions for interviewer", "engagement", "engineering culture", "scalability hurdles", "code review", "team dynamics", "success metrics"]
    }
];

// Verify question count and export for browser
if (typeof window !== "undefined") {
    window.interviewQuestions = interviewQuestions;
}
