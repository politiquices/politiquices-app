import React, { useEffect, useState} from 'react'


function DataFetching() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://jsonplaceholder.typicode.com/posts')
        .then(res => {
            console.log(res.data)
            setPosts(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    })

    return (
        <div>{posts.map(post => <li key={post.id}>{post.title}</li>)}</div>        
    )
}

export default DataFetching
