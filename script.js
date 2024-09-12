let investments = JSON.parse(localStorage.getItem("investments")) || [];
let totalPortfolioValue = 0;
let chartInstance = null;

// DOM Elements
const investmentForm = document.getElementById("investment-form");
const addInvestmentBtn = document.getElementById("add-investment-btn");
const addInvestment = document.getElementById("add-investment");
const investmentList = document.querySelector("#investment-list tbody");
const totalValueElem = document.getElementById("total-value");
const portfolioChartElem = document.getElementById("portfolio-chart");

// Initialize portfolio on load
document.addEventListener("DOMContentLoaded", () => {
    updatePortfolio();
});

// Show the form to add a new investment
addInvestmentBtn.addEventListener("click", () => {
    investmentForm.classList.toggle("hidden");
});

// Add a new investment
addInvestment.addEventListener("click", () => {
    const assetName = document.getElementById("asset-name").value.trim();
    const investmentAmount = parseFloat(document.getElementById("investment-amount").value);
    const currentValue = parseFloat(document.getElementById("current-value").value);

    if (assetName && investmentAmount > 0 && currentValue > 0) {
        const newInvestment = {
            assetName,
            investmentAmount,
            currentValue,
            percentageChange: ((currentValue - investmentAmount) / investmentAmount) * 100
        };

        investments.push(newInvestment);
        saveToLocalStorage();
        updatePortfolio();
        investmentForm.classList.add("hidden");
        clearForm();
    } else {
        alert("Please enter valid values.");
    }
});

// Update portfolio
function updatePortfolio() {
    investmentList.innerHTML = '';
    totalPortfolioValue = 0;

    investments.forEach((investment, index) => {
        totalPortfolioValue += investment.currentValue;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${investment.assetName}</td>
            <td>$${investment.investmentAmount.toFixed(2)}</td>
            <td>$${investment.currentValue.toFixed(2)}</td>
            <td>${investment.percentageChange.toFixed(2)}%</td>
            <td>
                <button onclick="removeInvestment(${index})">Remove</button>
            </td>
        `;
        investmentList.appendChild(row);
    });

    totalValueElem.textContent = totalPortfolioValue.toFixed(2);
    updateChart();
}

// Remove an investment
function removeInvestment(index) {
    investments.splice(index, 1);
    saveToLocalStorage();
    updatePortfolio();
}

// Clear form inputs
function clearForm() {
    document.getElementById("asset-name").value = '';
    document.getElementById("investment-amount").value = '';
    document.getElementById("current-value").value = '';
}

// Save investments to localStorage
function saveToLocalStorage() {
    localStorage.setItem("investments", JSON.stringify(investments));
}

// Update chart visualization
function updateChart() {
    const assetNames = investments.map(inv => inv.assetName);
    const assetValues = investments.map(inv => inv.currentValue);

    // Destroy previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(portfolioChartElem, {
        type: 'pie',
        data: {
            labels: assetNames,
            datasets: [{
                data: assetValues,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}
