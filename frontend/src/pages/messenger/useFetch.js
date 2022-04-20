import { useState, useEffect } from 'react';
import axios from 'axios';
const useFetch = (url) => {
    const [data, setData] = useState(null);
    useEffect(()=>{
        const getData = async() =>{
            try {
                const res = await axios.get(url);
                setData(res.data);   
            } catch (error) {
                console.log(error);
            }
        };
        getData()
    }, [url])



    return { data };
}

export default useFetch;