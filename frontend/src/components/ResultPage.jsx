import { useSearchParams } from "react-router-dom";
import { useState } from 'react';

export default function ResultPage(){

const [searchParams,setSearchParams] = useSearchParams();
const [posts,setPosts] = useState([]);


  return(
  <h1>Posts</h1>
);
}
