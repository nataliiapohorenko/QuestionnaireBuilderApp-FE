# Questionnaire Builder App
Note: Since the project is deployed on Render, which is a free hosting service, the website may take up to a minute to load when accessed for the first time or after a period of inactivity.
  FE: 
    https://questionnairebuilderapp-fe.onrender.com
  BE:
    https://questionnairebuilderapp-be.onrender.com

## Features

### ✅ Base Level (Completed)
- **Questionnaire Catalog Page**
  - Displays a paginated list of available questionnaires
  - Actions with cards: Edit / Run / Delete

- **Questionnaire Builder Page**
  - Allows users to add multiple questions
  - Added simple validation
  - Stores created questionnaire in the database

- **Interactive Questionnaire Page**
  - Users complete the questionnaire
  - Displays answers and time taken upon completion
  - Stores responses in the database

### ✅ Middle Level (Completed)
- Sorting on the questionnaire catalog page by:
  - Name
  - Number of questions
  - Number of completions
- Drag & Drop:
  - Reorder questions in the builder
  - Reorder answers for single/multiple choice
- Intermediate save state for questionnaire completion
  - Uses localStorage to persist progress and time

### ✅ Advanced Level (Completed)
- Infinite scroll on the catalog page
  - Dynamically loads more questionnaires as the user scrolls
  - Also includes pagination with Next/Previous buttons
- **Questionnaire Statistics Page**
  - Metrics:
    - Average completion time
    - Completions per day/week/month (bar/line charts)
    - Pie charts for each question's answers
- **Image Question Type**
  - Users can upload an image as a response
  - Images are previewed during questionnaire completion
  - Stored and displayed in results/statistics

---

## Technologies Used
- **Frontend:** React, TailwindCSS, @dnd-kit for drag-and-drop
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
