import { useSearchParams } from "react-router-dom";
import { useState } from 'react';
import { useTheme } from "./context/themeContext";
export default function ResultPage(){
  const {theme, toggleTheme} = useTheme();
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
const [searchParams,setSearchParams] = useSearchParams();
const [posts,setPosts] = useState([]);


  return(
  <h1>Posts</h1>
);
}
