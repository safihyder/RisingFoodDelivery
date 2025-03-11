import Card from "../../components/card/Card"
import "./Items.css"
const Items = ({ items }) => {
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-6 justify-items-center">

            {items ? items.map((item, index) => {
                return <Card key={index} item={item} />
            }) : <div />
            }
        </div>
    )
}

export default Items