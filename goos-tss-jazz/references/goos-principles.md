# GOOS Principles Reference

Complete reference for "Growing Object-Oriented Software, Guided by Tests" (Freeman & Pryce).

## Part I: Introduction (Ch 1-3)

### Software as a Learning Process
- Software development is a learning process; working code is a side effect
- Feedback is the fundamental tool for learning
- Nested feedback loops: unit tests (seconds) → integration tests (minutes) → acceptance tests (hours) → deployment (days)
- Practices that support change: constant testing + simple code

### The TDD Cycle
- **Red-Green-Refactor**: Write failing test → make it pass → clean up
- **The Golden Rule**: Never write new functionality without a failing test
- **The Bigger Picture**: Acceptance test wrapping unit test cycles (outer/inner loops)
  - Outer loop: Write a failing acceptance test for the next feature
  - Inner loop: Red-Green-Refactor unit tests until acceptance test passes

### Levels of Testing
- **Acceptance tests**: Does the whole system work end-to-end? Exercise system from outside
- **Integration tests**: Does our code work against code we can't change (DB, APIs)?
- **Unit tests**: Do our objects do the right thing? Are they convenient to work with?

### Quality
- **External quality**: System meets user needs (behavior, reliability, usability)
- **Internal quality**: System is easy to change (structure, readability, cohesion)
- Running end-to-end tests tells us about external quality
- Writing unit tests tells us about internal quality (listen to the tests)

### Object-Oriented Design Principles
- **A web of objects**: Focus on communication between objects, not classification
- **Values vs Objects**: Values are immutable quantities; objects have identity and state
- **Follow the messages**: The domain model IS the communication patterns between objects
- **Tell, Don't Ask** (Law of Demeter): Describe what you want done, not how to do it
- **Coupling**: Degree to which components depend on each other (minimize)
- **Cohesion**: Degree to which a component's responsibilities belong together (maximize)

### Mock Objects
- Unit-test collaborating objects by substituting mock objects for peers
- Mock object structure: create mocks → create target → set expectations → trigger → assert
- Interface discovery through TDD: let tests drive out the interfaces objects need

## Part II: The Process of TDD (Ch 4-8)

### Walking Skeleton
- Thinnest possible slice of real functionality
- Build, deploy, and test end-to-end
- Decides broad-brush architecture (whiteboard-level)
- Build sources of feedback early; expose uncertainty early (front-load risk)

### Feature Development Cycle
1. Start each feature with a failing acceptance test
2. Separate progress tests from regression tests
3. Start with the simplest success case (not degenerate or failure cases)
4. Write the test you'd want to read
5. Watch the test fail (verify diagnostics are useful)
6. Develop from inputs to outputs (outside-in)
7. Unit-test behavior, not methods
8. Listen to the tests: difficulty writing tests = design feedback

### Tuning the Cycle
- Balance unit vs integration testing based on project needs
- More integration tests when: integration is risky or poorly understood
- More unit tests when: logic is complex or design is evolving

## Part III: Object-Oriented Style (Ch 6-8)

### Ports and Adapters (Hexagonal Architecture)
- Core domain logic knows nothing about infrastructure
- Ports: interfaces that the domain defines
- Adapters: implementations that connect ports to infrastructure

### Encapsulation vs Information Hiding
- **Encapsulation**: Ensure object's behavior is only affected through its API
- **Information Hiding**: Conceal how an object implements its functionality
- These are separate concepts; both required

### Internals vs Peers
- **Internals**: Implementation details, private methods, internal state
- **Peers**: Other objects this object communicates with
- Object should make its peers explicit (via constructor or method parameters)

### Single Responsibility
- "No And's, Or's, or But's": A class description shouldn't need conjunctions
- If you can't describe what an object does without "and", it does too much

### Object Peer Stereotypes
- **Dependencies**: Services the object needs to function (injected via constructor)
- **Notifications**: Objects that need to know about state changes (observers)
- **Adjustments**: Configuration that tweaks behavior (policies, strategies)

### Composition and Context
- **Composite simpler than the sum of its parts**: Composed objects should present a simpler API than their components
- **Context Independence**: Objects should have no built-in knowledge of their environment
- Objects should be usable in different contexts without modification

### Hiding the Right Information
- Hide implementation details, not domain concepts
- Interfaces should express domain concepts at the right abstraction level

### How TDD Helps Design
- Writing tests first forces you to think about the interface before the implementation
- **Communication over Classification**: Focus on what messages objects send, not inheritance

### Value Types
- **Breaking out**: Extract a value type when a concept emerges from primitives
- **Budding off**: Create a new type when an object has too many responsibilities
- **Bundling up**: Group related values into a single type

### Where Do Objects Come From?
- Same three patterns: breaking out, budding off, bundling up
- Identify relationships with interfaces: narrow, role-based interfaces
- Refactor interfaces too (not just implementation)

### Composing Objects
- Compose objects to describe system behavior
- Build up to higher-level programming: declarative layer + implementation layer
- Higher-level code reads like a domain description

### Adapter Layer
- **Only mock types that you own**
- Write an adapter layer for third-party code
- Mock application objects (your adapters) in integration tests
- Never mock third-party types directly

## Part IV: Sustainable TDD (Ch 20-24)

### Listening to the Tests (Design Feedback)
- **Don't mock values**: Values are immutable, use real ones
- **Bloated constructor**: Too many dependencies = object does too much
- **Confused object**: Mixed abstraction levels or mixed responsibilities
- **Too many dependencies**: Object has too many peers
- **Too many expectations**: Test is too coupled to implementation

### Test Readability
- **Names describe features**: Test name should state the behavior, not the method
- **Canonical test structure**: Arrange (given) → Act (when) → Assert (then)
- **Streamlined code**: Remove noise, keep only what matters for understanding

### Test Data Builders
- Build test objects with sensible defaults
- Override only what matters for each test
- Chain builder methods for readability
- Pattern: `aCustomer().withName("Alice").withBalance(100).build()`

### Test Diagnostics
- **Design to fail**: Write tests so failures are obvious and informative
- **Small focused tests**: Each test checks one behavior
- **Self-describing values**: Use values that explain their purpose ("expected-name@test.com")

### Test Flexibility
- **Test for information, not representation**: Assert on meaning, not exact format
- **Precise assertions**: Don't assert more than necessary
- Avoid asserting on implementation details that might change

## Part V: Advanced Topics (Ch 25-27)

### Testing Persistence
- Isolate persistence tests from each other
- Use explicit transaction boundaries
- Round-trip test: save → load → verify equality
- Test with the real database when possible

### Unit Testing and Threads
- Separate functionality from concurrency
- Test the logic in single-threaded unit tests
- Test synchronization separately
- Minimize the code that needs to be thread-aware

### Testing Asynchronous Code
- **Sampling**: Poll until condition met or timeout (less precise, simpler)
- **Listening**: Register for notifications (more precise, more complex)
- Always use timeouts to prevent tests from hanging
- Make asynchronous tests deterministic where possible
