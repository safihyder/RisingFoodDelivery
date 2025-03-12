import Card from "../../components/Card/Card"
import "./Items.css"
const Items = ({ items }) => {
    return (

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center">
            {items ? items.map((item, index) => {
                return <Card key={index} item={item} />
            }) : <div />
            }
        </div>
    )
}
export default Items