import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

const PostAddPage = () => {
    const {user,authTokens}=useContext(AuthContext)
    const navigate = useNavigate();

    const onPostSubmit =async (e)=> {
        e.preventDefault();
        const formData=new FormData();
        formData.append('author',user.user_id)
        formData.append('username',user.username);
        formData.append('body',e.target.description.value)
        formData.append('image',e.target.postImage.files[0]);
        try {
            let response = await fetch('http://127.0.0.1:8000/api/posts/',{
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData
            })
            if(!response.ok){
                throw new Error('Could not add post');
            }
        } catch (error) {
            console.log(error)
        } finally{
            navigate('/')
        }
    }
    
    return (
        <>
            <section className="container-fluid" style={{maxWidth:"935px"}}>
                <p className="text-center">Add Page</p>
                <form onSubmit={onPostSubmit} encType="multipart/form-data">

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input type="text" 
                             className="form-control" 
                             id="postDescription" 
                             name="description"/>
                        <div className="form-text">share your thoughts.</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input 
                             type="file" 
                             className="form-control" 
                             id="postImage"/>
                    </div>

                    <button className="btn btn-primary">Submit</button>
                </form>
            </section>
        </>
    )
}
export default PostAddPage;
