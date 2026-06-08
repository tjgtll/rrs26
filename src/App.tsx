import { useState } from 'react';
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/UncontrolledForm';
import { RHFForm } from './components/RHFForm';
import { useFormStore } from './store/formStore';
import './App.css';

function App() {
  const [uncontrolledModalOpen, setUncontrolledModalOpen] = useState(false);
  const [rhfModalOpen, setRHFModalOpen] = useState(false);
  const submissions = useFormStore((state) => state.submissions);
  const highlightNewId = useFormStore((state) => state.highlightNewId);

  return (
    <div className="app">
      <h1>📝 Form Submissions</h1>
      <div className="forms-buttons">
        <button onClick={() => setUncontrolledModalOpen(true)}>
          Uncontrolled Form
        </button>
        <button onClick={() => setRHFModalOpen(true)}>React Hook Form</button>
      </div>

      <Modal
        isOpen={uncontrolledModalOpen}
        onClose={() => setUncontrolledModalOpen(false)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={() => setUncontrolledModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={rhfModalOpen}
        onClose={() => setRHFModalOpen(false)}
        title="React Hook Form"
      >
        <RHFForm onSuccess={() => setRHFModalOpen(false)} />
      </Modal>

      <div className="submissions-list">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="submission-card"
            style={{
              borderColor: highlightNewId === sub.id ? 'gold' : '#ccc',
              backgroundColor:
                highlightNewId === sub.id ? '#fff8e7' : 'var(--card-bg)',
            }}
          >
            {sub.imageBase64 && (
              <img
                src={sub.imageBase64}
                alt={sub.name}
                className="submission-avatar"
              />
            )}
            <h3>{sub.name}</h3>
            <p>Age: {sub.age}</p>
            <p>Email: {sub.email}</p>
            <p>Country: {sub.country}</p>
            <p>Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
