import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/stats', (req, res) => {
  const products = db.prepare('SELECT COUNT(*) as count FROM products WHERE active = 1').get()
  const categories = db.prepare('SELECT COUNT(*) as count FROM categories WHERE active = 1').get()
  const requests = db.prepare('SELECT COUNT(*) as count FROM requests').get()
  const newRequests = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'new'").get()
  const blogPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get()
  const banners = db.prepare('SELECT COUNT(*) as count FROM banners WHERE active = 1').get()

  const recentRequests = db.prepare(
    "SELECT id, type, status, name, phone, product_name, created_at FROM requests ORDER BY created_at DESC LIMIT 5"
  ).all()

  res.json({
    products: products.count,
    categories: categories.count,
    requests: requests.count,
    newRequests: newRequests.count,
    blogPosts: blogPosts.count,
    banners: banners.count,
    recentRequests,
  })
})

export default router
