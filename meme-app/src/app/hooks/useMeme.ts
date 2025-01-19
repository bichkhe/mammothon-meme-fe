// import { useQuery } from 'convex/react';
// import { useState, useEffect } from 'react';
import { api } from '../../../convex/_generated/api';
import { useMemeStore } from '@/store/meme';
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
const useMeme = () => {
    const {searchText} = useMemeStore();
    const  {data: fetchMemes} = useQuery(convexQuery(api.meme.get, {}));
    const  {data: searchMemes}= useQuery(convexQuery(api.meme.search, { query: searchText }));

    if (!searchText) {
        return { memes: fetchMemes, loading: false, error:  null, searchText };
    } else {
        return { memes: searchMemes, loading: false, error: null, searchText };
    }
    
};

export default useMeme;