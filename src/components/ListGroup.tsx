import { useState } from 'react';

interface ListGroupProps {
    items: string[] | number[] | Object[];
    heading: string;
    onSelectItem: (item: string | number | Object) => void;
}
function ListGroup({items, heading, onSelectItem}: ListGroupProps) {
    // Hook
    const [selectedIndex, setSelectedIndex] = useState(-1)
    
    return (
        // empty <> replaces a Fragment
        <>
            <h1>{heading}</h1>
            <ul className="list-group">
                {items.map((item, index) => (
                    <li 
                      className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
                      key={item}
                    onClick={() => { 
                        setSelectedIndex(index);
                        onSelectItem(item);
                    }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ListGroup;