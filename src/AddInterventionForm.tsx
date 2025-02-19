import React, { useState } from 'react';
import type { Intervention } from './types';
import { XCircle } from 'lucide-react';

interface AddInterventionFormProps {
  onAddIntervention: (intervention: Intervention) => void;
  onCancel: () => void;
}

const AddInterventionForm: React.FC<AddInterventionFormProps> = ({ onAddIntervention, onCancel }) => {
  const [client, setClient] = useState('');
  const [adresse, setAdresse] = useState('');
  const [type, setType] = useState<'maintenance' | 'depannage' | 'installation'>('maintenance');
  const [description, setDescription] = useState('');
  const [dureeEstimee, setDureeEstimee] = useState<number>(1);
  const [priorite, setPriorite] = useState<'basse' | 'normale' | 'haute' | 'urgente'>('normale');
  const [status, setStatus] = useState<'planifiee' | 'en-cours' | 'terminee' | 'reportee'>('planifiee');
  const [materielUtilise, setMaterielUtilise] = useState<string[]>([]);
  const [materielInput, setMaterielInput] = useState('');

  const handleMaterielAdd = () => {
    if (materielInput.trim() !== '' && !materielUtilise.includes(materielInput.trim())) {
      setMaterielUtilise([...materielUtilise, materielInput.trim()]);
      setMaterielInput('');
    }
  };

  const handleMaterielRemove = (materiel: string) => {
    setMaterielUtilise(materielUtilise.filter(m => m !== materiel));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIntervention: Intervention = {
      id: Date.now().toString(),
      client,
      adresse,
      type,
      description,
      dureeEstimee,
      priorite,
      status,
      materielUtilise
    };

    onAddIntervention(newIntervention);
    setClient('');
    setAdresse('');
    setType('maintenance');
    setDescription('');
    setDureeEstimee(1);
    setPriorite('normale');
    setStatus('planifiee');
    setMaterielUtilise([]);
    setMaterielInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Ajouter une intervention</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
          <input
            type="text"
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'maintenance' | 'depannage' | 'installation')}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="maintenance">Maintenance</option>
            <option value="depannage">Dépannage</option>
            <option value="installation">Installation</option>
          </select>
        </div>
        <div>
          <label htmlFor="dureeEstimee" className="block text-sm font-medium text-gray-700">Durée Estimée (heures)</label>
          <input
            type="number"
            id="dureeEstimee"
            value={dureeEstimee}
            onChange={(e) => setDureeEstimee(Number(e.target.value))}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="priorite" className="block text-sm font-medium text-gray-700">Priorité</label>
          <select
            id="priorite"
            value={priorite}
            onChange={(e) => setPriorite(e.target.value as 'basse' | 'normale' | 'haute' | 'urgente')}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'planifiee' | 'en-cours' | 'terminee' | 'reportee')}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="planifiee">Planifiée</option>
            <option value="en-cours">En Cours</option>
            <option value="terminee">Terminée</option>
            <option value="reportee">Reportée</option>
          </select>
        </div>
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="materielUtilise" className="block text-sm font-medium text-gray-700">Matériel Utilisé</label>
          <div className="flex items-center mt-1">
            <input
              type="text"
              id="materielUtilise"
              value={materielInput}
              onChange={(e) => setMaterielInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMaterielAdd()}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleMaterielAdd}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {materielUtilise.map(materiel => (
              <span key={materiel} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
                {materiel}
                <button
                  type="button"
                  onClick={() => handleMaterielRemove(materiel)}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Annuler
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default AddInterventionForm;
