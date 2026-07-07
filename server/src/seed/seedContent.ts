import { subjects, quizzes, questions } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { slugify } from "../utils/slugify.js";
import { seedSubjects } from "./content.js";
import type { Subject, Quiz, Question, Choice } from "../types/index.js";

/**
 * Populates subjects/quizzes/questions from the built-in content set, but
 * only if the subjects table is currently empty. Safe to call on every
 * server boot — it's a no-op once real data exists. Mainly useful the very
 * first time this connects to a brand-new, empty Postgres database (e.g.
 * a fresh Neon project), so the site never comes up with an empty catalog.
 */
export async function seedContentIfEmpty(): Promise<boolean> {
  const existingSubjects = await subjects.all();
  if (existingSubjects.length > 0) {
    return false;
  }

  const now = new Date().toISOString();
  const newSubjects: Subject[] = [];
  const newQuizzes: Quiz[] = [];
  const newQuestions: Question[] = [];

  seedSubjects.forEach((s, subjectOrder) => {
    const subjectId = generateId("subj");
    newSubjects.push({
      id: subjectId,
      slug: slugify(s.name),
      name: s.name,
      description: s.description,
      icon: s.icon,
      color: s.color,
      order: subjectOrder,
      createdAt: now,
      updatedAt: now,
    });

    s.quizzes.forEach((q, quizOrder) => {
      const quizId = generateId("quiz");
      newQuizzes.push({
        id: quizId,
        subjectId,
        slug: slugify(q.title),
        title: q.title,
        description: q.description,
        order: quizOrder,
        createdAt: now,
        updatedAt: now,
      });

      q.questions.forEach((question, questionOrder) => {
        const choices: Choice[] = question.choices.map((text) => ({
          id: generateId("c"),
          text,
        }));
        newQuestions.push({
          id: generateId("q"),
          quizId,
          text: question.text,
          choices,
          correctChoiceId: choices[question.correctIndex].id,
          order: questionOrder,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
  });

  await subjects.replaceAll(newSubjects);
  await quizzes.replaceAll(newQuizzes);
  await questions.replaceAll(newQuestions);

  console.log(
    `[seed] Created ${newSubjects.length} subjects, ${newQuizzes.length} quizzes, ${newQuestions.length} questions.`
  );
  return true;
}
