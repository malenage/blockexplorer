
interface GridProps {
    columnOne: string;
    columnTwo: string;
}
function Grid({columnOne, columnTwo}: GridProps) {    
    return (
        // empty <> replaces a Fragment
        <>
          <div className="container text-center">
            <div className="row">
                <div className="col">
                {columnOne}
                </div>
                <div className="col">
                2 of 2 {columnTwo}
                </div>
            </div>
          </div>
        </>
    );
}

export default Grid;