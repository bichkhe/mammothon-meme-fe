import { useQuery } from 'convex/react';
import { useState, useEffect } from 'react';
import { api } from '../../../convex/_generated/api';
import { useMemeStore } from '@/store/meme';

const useMeme = () => {
    const [memes, setMemes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {searchText} = useMemeStore();
    // setLoading(true);
    const  fetchMemes =  useQuery(api.meme.get);
    // const searchMemes =  useQuery(api.meme.get); 
    const searchMemes =  useQuery(api.meme.search, { query: searchText }); 
    console.log("useMeme hook:", searchText, memes, searchMemes);

    useEffect(() => {
        console.log("useEffect::search");
        // const searchMemes = async () => {
        //     try {
        //         const searchMemes = await useQuery(api.meme.get); 
        //         console.log("searchMemes1111:", searchMemes);
        //         setMemes(searchMemes);
        //     } catch (err) {
        //         // setError(err.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // console.log("searchMemes2222::");
        setMemes(fetchMemes);
    }, []);

    
    
    // const fetchMemes = async () => {
    //     try {
    //         console.log("sarch111:", searchText);
    //         if (searchText === "") {
    //             console.log('xxxxxxxxxxx')
    //             const searchMemes = await useQuery(api.meme.get); 

    //             console.log('response:xxxxxxxxxxx', searchMemes)
    //             console.log("get:", searchMemes);
    //             setMemes(searchMemes);
    //             return
    //         }
    //         const searchMemes = await useQuery(api.meme.search, { query: searchText }); 
    //         setMemes(searchMemes);
    //     } catch (err) {
    //         // setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    useEffect(() => {
        console.log("useEffect::fetch");
        if (searchText) {
           setMemes(fetchMemes);
        }
    }, [searchText]);


    console.log("return meme:", searchMemes, fetchMemes, searchText);
    if (!searchText) {
        return { memes: fetchMemes, loading, error, searchText };
    }
    return { memes: searchMemes, loading, error, searchText };
};

export default useMeme;