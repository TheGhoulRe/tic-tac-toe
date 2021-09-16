export default function Home ({history}) {
    const {push} = history;
    return (
        <div className="home">
            <h2>Select a mode</h2>
            <button className="buttons" onClick={() => push('/multiplayergame')}>Online Multi-player</button><br/>
            <button className="buttons" onClick={() => push('/localgame')}>Local Multi-player</button><br/>
            <button className="buttons" onClick={() => push('/cpugame')}>Single-player</button>
        </div>
    );
}