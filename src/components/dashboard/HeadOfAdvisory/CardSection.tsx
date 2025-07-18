import Active from "../../../assets/card/active.svg"
import Clients from "../../../assets/card/clients.svg"
import Login_Gap from "../../../assets/card/login_gap.svg"
import Card from './Card'


const PortfolioData = [
    {
        title: "Active Biases",
        slog: "mean_active_biases",
        value: 10,
        img: Clients
    },
    {
        title: "Risk-Profile Distribution",
        value: 15,
        img: Login_Gap
    },
    {
        title: "Clients Trading Complex Products",
        slog: "clients_trading_complex",
        value: 20,
        img: Active
    },
]
const AdvisoryData = [
    {
        title: "Total Active \n Clients",
        slog:"total_active_clients",
        value: 150,
        img: Clients
    },
    {
        title: "Average \n Account-Tenure",
        slog: "average_account_tenure",
        value: 45,
        img: Login_Gap
    },
    {
        title: "Average Risk \n Tolerance Score",
        slog: "average_risk_tolerance_score",
        value: 20,
        img: Active
    },
]

function PortfolioCardSection(props: { role: string; data: Record<string, any> }) {
    const { role, data } = props;
    const CardData = role === "Head of Advisory" ? AdvisoryData : PortfolioData;

    // Map CardData to inject dynamic values from data prop
    const cards = CardData.map(card => {
        let value = card.value;
        if (card.slog && data && data[card.slog]) {
            // If the data object has the slog key, use its value
            value = data[card.slog].value ?? data[card.slog];
        }
        return {
            ...card,
            value,
        };
    });

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 p-4'>
            {cards.map((card, index) => (
                <Card key={index} {...card} />
            ))}
        </div>
    );
}

export default PortfolioCardSection