import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ABI from './VotingABI.json';

const CONTRACT_ADDRESS = '0x62BDd6937A71A176dA9AECdFbdf2C059962926cb';

const CandidateCard = ({ id, name, role, description }) => {
  const [voteCount, setVoteCount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get provider
  const getProvider = () => {
    if (!window.ethereum) {
      alert('Please install MetaMask first!');
      return null;
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  // Get contract instance (provider or signer depending on whether it's a transaction)
  const getContract = async (useSigner = false) => {
    const provider = getProvider();
    if (!provider) return null;
    if (useSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    } else {
      return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    }
  };

  // Fetch current vote count
  const fetchVoteCount = async () => {
    const contract = await getContract(false);
    if (!contract) return;
    try {
      const candidate = await contract.candidates(id);
      setVoteCount(candidate.voteCount.toString());
    } catch (error) {
      console.error("Error fetching vote count:", error);
      setVoteCount('Error');
    }
  };

  // Vote
  const vote = async () => {
    try {
      setLoading(true);
      const contract = await getContract(true);
      const tx = await contract.vote(id);
      await tx.wait();
      alert('Vote successful!');
      fetchVoteCount();
    } catch (err) {
      alert('Vote failed. You may have already voted or rejected the transaction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteCount();
  }, [id]);

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={`https://i.pravatar.cc/150?u=${name}`}
          alt={name}
          style={styles.image}
        />
      </div>
      <h3 style={styles.name}>{name}</h3>
      <p style={styles.role}>{role}</p>
      <p style={styles.description}>{description}</p>
      <button onClick={vote} disabled={loading} style={loading ? styles.voteButtonDisabled : styles.voteButton}>
        {loading ? 'Voting...' : 'Vote Me'}
      </button>
      <p style={styles.voteCount}>Current Votes: {voteCount !== null ? voteCount : 'Loading...'}</p>
    </div>
  );
};

const VotingSection = () => {
  // Replace with your actual candidate data
  const candidates = [
    { id: 1, name: 'Alice Johnson', role: 'Project Manager', description: 'Oversees project development and team collaboration.' },
    { id: 2, name: 'Michael Lee', role: 'Lead Developer', description: 'Focuses on building the Web3 voting platform.' },
  ];

  return (
    <div style={styles.container}>
      {candidates.map(candidate => (
        <CandidateCard
          key={candidate.id}
          id={candidate.id}
          name={candidate.name}
          role={candidate.role}
          description={candidate.description}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    padding: '20px',
    width: '300px',
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 15px',
    border: '3px solid #eee',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  name: {
    margin: '0 0 5px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    margin: '0 0 10px',
    fontSize: '0.9rem',
    color: '#666',
  },
  description: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '15px',
  },
  voteButton: {
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  voteButtonDisabled: {
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'not-allowed',
    fontSize: '1rem',
  },
  voteCount: {
    marginTop: '10px',
    fontSize: '0.85rem',
    color: '#777',
  },
};

export default VotingSection;
