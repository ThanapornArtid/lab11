[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/CnWx6uam)
# Faculty of Information and Communication Technology <br/> ITCS257 Frontend Application Development <br/> Advance TypeScript

## Objectives

The objective of this lab is to:

- Understand how to connect a frontend interface to backend APIs using TypeScript
- Implement CRUD (Create, Read, Update, Delete) operations for an invoice management system
- Practice working with HTTP requests in a TypeScript environment
- Handle API responses and manage application state
- Apply error handling techniques when working with external APIs

## Exercise Tasks
This exercise builds on the "Responsive Web Design and Mobile-first Approach" lab. You have already created the user interface for the invoice management system. In this lab, you will use TypeScript to connect the UI with APIs and deploy your previously created UIs to a web server (such as ExpressJS). You will also need to ensure all operations are user-friendly. 

### Task 1: API Connection Setup

- Create a TypeScript service/module for API communication
- Implement configuration for API base URL and headers
- Set up an authentication mechanism if required by the API
- Create TypeScript type interfaces that match the API data structures

### Task 2: Read and Search Operations

- Implement functionality to fetch all invoices from the API
- Create a function to retrieve a single invoice by ID
- Create a function to search for invoices regarding the criteria, including company name, client email, start issue date, and end issue date
- Display the fetched data in your invoice interface

### Task 3: Create Operations

- Implement a form to create new invoices
- Add form validation using TypeScript
- Create a function to send new invoice data to the API
- Handle the API response and update the UI accordingly

### Task 4: Error Handling

- Implement error handling for all API requests
- Display appropriate error messages to users

## Extra Tasks

### Task 1: Update Operations

- Implement functionality to edit existing invoices
- Create a form pre-populated with the invoice data
- Send updated invoice data to the API
- Refresh the displayed data after successful updates

### Task 2: Delete Operations

- Add functionality to delete invoices
- Implement a confirmation dialog before deletion
- Send delete requests to the API
- Update the UI after successful deletion

## Submission

1. **Include a Generative AI usage declaration and reflection** at the beginning of your code file. Clearly state if AI tools were used and briefly reflect on your work.
2. **Push your code** to the provided GitHub Classroom repository for this assignment. Make sure all your code is committed and pushed before the submission deadline.
3. Submit the lab by the end of the next class session to the LAs. Late submissions may not be accepted.

## AI Usage Declaration and Reflection

Students must add an AI Declaration and Reflection of Today's Learning to the top of their code file.

A reflection is not a summary of what you did or what the AI generated.
Instead, it is a personal explanation of your learning process.

- If you used AI, focus on how AI impacted your learning or understanding of the code.
- If you did not use AI, focus on your learning, tools, and experience from the lab.

Here are examples:

### Example 1 – No AI Used

```tsx
/*
AI Declaration:
No Generative AI tools were used for this lab.
All code was written manually by the student.

Reflection:
[ Your Reflection goes here
Today’s lab helped me learn [key takeaway].
I practiced ...
]
*/

```

### Example 2 – AI Used for Reference

```tsx
/*
AI Declaration:
I used ChatGPT only to clarify HTML semantic tags.
No code was directly copied without modification.

Reflection:
[ Write 1–2 sentences reflecting on your learning or how AI impacted your understanding]
*/

```

### Example 3 – AI Assisted in Debugging

```tsx
/*
AI Declaration:
I used ChatGPT to help debug the table structure in my invoice layout.
I wrote all the other code, and I understand the entire implementation.

Reflection:
[ Write 1–2 sentences reflecting on your learning or how AI impacted your understanding ]
*/

```

## Resources

- **TypeScript HTTP Client Libraries:**
    - Axios: https://axios-http.com/docs/intro - Popular promise-based HTTP client
    - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API - Native browser API for making HTTP requests
- **TypeScript Interface Documentation:**
    - Official TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/interfaces.html
    - TypeScript Deep Dive: https://basarat.gitbook.io/typescript/type-system/interfaces
- **Error Handling Best Practices:**
    - TypeScript Error Handling: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
    - Error Handling in Async/Await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
    - Axios Error Handling: https://axios-http.com/docs/handling_errors
