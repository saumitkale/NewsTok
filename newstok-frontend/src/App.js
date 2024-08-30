import React, { useState } from 'react';

const App = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(''); 
    const [url,setUrl] = useState(null);
    const [source, setSource] = useState(''); 

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/articles?source=${encodeURIComponent(source)}&index=${encodeURIComponent(index)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSummary(data.summary);
            setUrl(data.url);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChangeIndex = (event) => {
        setIndex(event.target.value);
    };

    const handleInputChangeSource = (event) => {
        setSource(event.target.value);
    };

    return (
        <div>
            <h1>Article Summary</h1>
            <input
                type="number"
                value={index}
                onChange={handleInputChangeIndex}
                placeholder="Enter article index"
            />
            <input
                type="text"
                value={source}
                onChange={handleInputChangeSource}
                placeholder="Enter article source"
            />
            <button onClick={fetchSummary}>Fetch Article</button>
            {loading && <p>Generating Article Summary...</p>}
            {error && <p>Error: {error.message}</p>}
            {url && <h2>Link to Original Article: {url}</h2>}
            {summary && <p>{summary}</p>}
        </div>
    );
};

export default App;
