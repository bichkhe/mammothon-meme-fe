// import { useQuery } from 'convex/react';
// import { useState, useEffect } from 'react';
import { api } from '../../../convex/_generated/api';
import { useMemeStore } from '@/store/meme';
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
const useMeme = () => {
    const {searchText} = useMemeStore();
    const  {data: fetchMemes, isLoading} = useQuery(convexQuery(api.meme.get, {}));
    const  {data: searchMemes, isLoading: isLoadingSearch, error}= useQuery(convexQuery(api.meme.search, { query: searchText,
         paginationOpts: {numItems: 2, cursor: null }}));

    if (!searchText) {
        return { memes: fetchMemes, loading: isLoading, error:  null, searchText };
    } else {
        return { memes: searchMemes, loading: isLoadingSearch, error: error, searchText };
    }
    
};

export default useMeme;