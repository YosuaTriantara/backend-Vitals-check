import { healthArticles } from '../data/healthArticles.js';

export function getArticles(category) {
  if (!category) {
    return healthArticles;
  }

  return healthArticles.filter((article) => article.category === category);
}
