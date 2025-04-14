<<<<<<< HEAD
import {Hono} from 'hono';
import {userRouter} from './routes/user'
import {blogRouter} from './routes/blog'
import {cors} from 'hono/cors';


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();
 
app.use('/*', cors())
app.route("/api/v1", userRouter)
app.route("/api/v1/blog", blogRouter)

export default app
=======

import {z} from 'zod'

export const signupInput = z.object({
  email:z.string().email(),
  password:z.string().min(6),
  name:z.string().optional()
})

export const signinInput = z.object({
    email:z.string().email(),
    password:z.string().min(6)
  })

  export const createBlogInput = z.object({
    title:z.string(),
    content: z.string(),
  })

  export const updateBlogInput = z.object({
    title:z.string(),
    content: z.string(),
    id: z.number()
  })



  export type SignupInput = z.infer<typeof signupInput>
  export type SigninInput = z.infer<typeof signinInput>
  export type createBlogInput = z.infer<typeof createBlogInput>
  export type updatelogInput = z.infer<typeof updateBlogInput>
>>>>>>> c3855f2 (Add common folder code)
