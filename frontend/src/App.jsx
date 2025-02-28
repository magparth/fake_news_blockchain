// Frontend (React + TailwindCSS) - Fetching News from API & Reporting Fake News
import { useState, useEffect } from "react";
import Web3 from "web3";

const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=18a87f17ef6645f69c5f4c5202f8fadb";
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "headline",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "url",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "reporter",
        "type": "address"
      }
    ],
    "name": "NewsReported",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "NewsVoted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newsId",
        "type": "uint256"
      }
    ],
    "name": "getNews",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "newsReports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "headline",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "url",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "reporter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "votes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_headline",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_url",
        "type": "string"
      }
    ],
    "name": "reportFakeNews",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "reputation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newsId",
        "type": "uint256"
      }
    ],
    "name": "voteFakeNews",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = "0x6779e8c6F659B28701b83F7cA33C1E7d3d9E2d17";

function Card({ children }) {
  return <div className="p-4 border rounded shadow bg-white">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

export default function FakeNewsApp() {
  const [account, setAccount] = useState(null);
  const [news, setNews] = useState([]);
  const [reportedNews, setReportedNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    connectWallet();
    fetchNews();
    fetchReportedNews();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function fetchNews() {
    try {
      const response = await fetch(NEWS_API_URL);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  async function reportFakeNews(headline, url) {
    if (!account) return alert("Connect MetaMask first");
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    await contract.methods.reportFakeNews(headline, url).send({ from: account });
    alert("News reported successfully!");
    fetchReportedNews();
  }

  async function fetchReportedNews() {
    setReportedNews([]);
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto  shadow-md rounded-lg ">
      <h1 className="text-2xl font-bold mb-4">Blockchain Fake News Reporting</h1>
      <p className="mb-2">Connected Account: {account || "Not Connected"}</p>
      <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        {account ? "Connected" : "Connect Wallet"}
      </button>
      
      <input 
        type="text" 
        placeholder="Search news..." 
        value={searchQuery} 
        onChange={handleSearchChange} 
        className="w-full p-2 border rounded mb-4"
      />
      
      <h2 className="text-xl font-semibold mt-6">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((n, index) => (
          <Card key={index}>
            <CardContent>
              <p className="font-bold">{n.title}</p>
              <a href={n.url} target="_blank" className="text-blue-600 underline">
                {n.url}
              </a>
              <button
                onClick={() => reportFakeNews(n.title, n.url)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Report Fake
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
