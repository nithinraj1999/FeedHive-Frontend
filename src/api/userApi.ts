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
    console.log(data);
    
    console.log(data);
    
    const response = await userInstance.post("/get-all-articles",data)
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


export const saveUserCategories = async (data:any)=>{
    console.log("...",data);
    
    const response = await userInstance.post("/select-category",data)
    return response.data
}



export const updateArticleReaction =async (data:any)=>{
    console.log(data);
    if(data.type =="like"){
        const response = await userInstance.patch("/like-article",data)
        return response.data
    }else{
        const response = await userInstance.patch("/dislike-article",data)
        return response.data
    }
}
