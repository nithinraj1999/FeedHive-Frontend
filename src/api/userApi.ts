import { userInstance } from "./axiosInstance/userAxiosInstance";

export const editProfile = async (data:any)=>{
    const response = await userInstance.patch("/edit-profile",data)
    return response.data
}

export const getAllCategories = async ()=>{
    const response = await userInstance.get("/get-all-categories")
    return response.data
}   

export const createArticles = async(data:any)=>{
    const response = await userInstance.post("/create-article",data,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
    })
    return response.data
}   



export const getAllArticles = async (data:any)=>{
    const response = await userInstance.get("/get-all-articles")
    return response.data
}   


export const viewArticles = async (data:any)=>{
    const response = await userInstance.post("/view-article",data)
    return response.data
}   




export const getMyArticles = async (data:any)=>{
    const response = await userInstance.post("/my-articles",data)
    return response.data
}   


export const updateArticle = async (data:any)=>{
    const response = await userInstance.put("/edit-article",data,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
    })
    return response.data
}   

