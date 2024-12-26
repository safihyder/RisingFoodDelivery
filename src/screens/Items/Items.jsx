import Card from "../../components/card/Card"
import "./Items.css"
const Items = ({ items }) => {
    return (
        <div className="items-container">
            {items ? items.map((item, index) => {
                return <Card key={index} item={item} />
            }) : <div />
            }
        </div>
    )
}

export default Items