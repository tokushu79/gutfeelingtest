import { subjects, quizzes, questions } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { slugify } from "../utils/slugify.js";
import { seedSubjects } from "./content.js";
import type { Subject, Quiz, Question, Choice } from "../types/index.js";

/**
 * Populates subjects/quizzes/questions from the built-in content set, but
 * only if the subjects collection is currently empty. Safe to call on every
 * server boot — it's a no-op once real data exists. This exists so hosts
 * with ephemeral/non-persistent disks (e.g. a free-tier PaaS restart wiping
 * server/data/*.json) recover the standard quiz content automatically
 * instead of coming back up with an empty site. Player-submitted data
 * (attempts, leaderboards, custom admin edits) cannot be recovered this way —
 * only a real persistent disk or external database prevents that loss.
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
