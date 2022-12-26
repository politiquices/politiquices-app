
import React from 'react';

// https://blog.openreplay.com/data-fetching-techniques-with-react

fetch('http://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));


const Notes = ({ data }) => {
  return (
    <div>
      <ul>
        {data && data.map((item, index) => <li key={index}>{item.title}</li>)}
      </ul>
    </div>
  );
};
export default Notes;