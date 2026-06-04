import * as articleService from '../services/article.service.js';

export function getArticles(req, res, next) {
  try {
    const articles = articleService.getArticles(req.query.category);

    return res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
}
