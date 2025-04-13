import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@rilini/medium-common'




export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables:{
        userId: string
    }
}>();


blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("authorization") || "";
    const user = await verify(header, c.env.JWT_SECRET) as {id: string}
    if(user){
        c.set("userId", user.id);
      await next()
    }else{
      c.status(403)
      return c.json({message:"unauthorized"})
    }
  })



blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
     if(!success){
        c.status(411)
        return c.json({
            message:"Inputs not correct"
        })
     }
    const authorId = c.get("userId");
   const prisma = new PrismaClient({
       datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate())
   
const blog = await prisma.blog.create({
    data:{
        title:body.title,
        content:body.content,
        authorId: authorId
    },
})
return c.json({
    id: blog.id
})
  })
  


  blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success){
       c.status(411)
       return c.json({
           message:"Inputs not correct"
       })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
 const blog = await prisma.blog.update({
     where:{
         id:body.id
     },
     data:{
         title:body.title,
         content:body.content
         
     }
 })
 return c.json({
     id:blog.id
 })
  })


  blogRouter.get('/bulk', async(c) => {
    const prisma= new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs= await prisma.blog.findMany();

    return c.json({
        blogs
    })
  })


  

  blogRouter.get('/:id', async (c)=>{
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
 try{
    const blog = await prisma.blog.findFirst({
        where:{
            id: id
        },
     })
     return c.json({
          blog
     });
 }catch(e){
    c.status(411)
    return c.json({
        message:"Error while  fetching blog post"
    });
 }
  })


  
  

