import "./Page404.css";
import { useNavigate } from "react-router-dom";

const Page404 = ()=>{
    const navigate= useNavigate();
    return(
        <div className="page_4041">
            
  <div className="container12">
  <h1 className="text-center1">Oops!</h1>
    <div className="row"> 
    <div className="col-sm-12 ">
    <div className="col-sm-10 col-sm-offset-1  text-center">
    <div className="four_zero_four_bg">
      
    
    
    </div>
    
    <div className="contant_box_404">
    <h3 className="h2">
    Look like you're lost
    </h3>
    
    <p>The page you're looking for is not available!</p>

    <div className="centered">    <div onClick={()=>{navigate("/")}} className="link_404">Go to Home</div></div>
    

  </div>
    </div>
    </div>
    </div>
  </div>
</div>
    );
};

export default Page404;