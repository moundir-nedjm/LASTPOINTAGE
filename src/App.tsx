import React, { useState, useEffect } from 'react';
import { Clock, UserCircle, Users, Building2, BarChart2, Calendar, Briefcase, Phone, Mail, MapPin, BookOpen, AlertTriangle, Car, PenTool as Tool, FileCheck, Clock4, PlusCircle, Edit } from 'lucide-react';
import type { Employe, Pointage, Departement, Statistiques, Intervention } from './types';
import { useSpring, animated } from 'react-spring';
import AddEmployeeForm from './AddEmployeeForm';
import AddInterventionForm from './AddInterventionForm';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employes, setEmployes] = useState<Employe[]>([
    {
      id: '1',
      nom: 'ABDESLAM',
      prenom: 'YAHIYA CHERIF',
      departement: 'Commercial',
      poste: 'Business Development Manager',
      email: 'yahia.abdeslam@ndejm-froid.dz',
      telephone: '05 50 12 34 56',
      dateEmbauche: new Date('2023-07-15'),
      photo: null,
      statut: 'actif',
      competences: ['Developpement Commercial', 'Négociation', 'Stratégie'],
      certifications: ['Vente B2B', 'Management commercial'],
      horaires: {
        debut: '09:00',
        fin: '17:30',
        pauseDejeuner: true
      }
    },
    {
      id: '2',
      nom: 'Boufaa',
      prenom: 'Moundir',
      departement: 'Finance',
      poste: 'Financial Developer',
      email: 'moundir.boufaa@ndejm-froid.dz',
      telephone: '05 55 98 76 54',
      dateEmbauche: new Date('2023-06-20'),
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      statut: 'actif',
      competences: ['Finance', 'Developpement', 'Analyse'],
      certifications: ['Finance', 'Habilitation'],
      vehiculeService: false,
      zoneIntervention: [],
      horaires: {
        debut: '08:00',
        fin: '16:30',
        pauseDejeuner: true
      }
    },
    {
      id: '3',
      nom: 'Bakhouche',
      prenom: 'Abdelkrim',
      departement: 'Finance',
      poste: 'Financial Analyst',
      email: 'abdelkrim.bakhouche@ndejm-froid.dz',
      telephone: '05 60 23 45 67',
      dateEmbauche: new Date('2023-03-10'),
      photo: null,
      statut: 'actif',
      competences: ['Analyse Financiere', 'Gestion des comptes', 'Comptabilité'],
      certifications: ['Finance', 'Comptabilite'],
      vehiculeService: false,
      zoneIntervention: [],
      horaires: {
        debut: '09:00',
        fin: '17:30',
        pauseDejeuner: true
      }
    }
  ]);

  const [departements] = useState<Departement[]>([
    { 
      id: '1', 
      nom: 'Ressources Humaines', 
      responsable: '1',
      description: 'Gestion des talents et développement RH',
      objectifs: ['Réduction du turnover', 'Amélioration de la formation'],
      effectifCible: 3,
      budget: {
        formation: 1500000, // DZD
        equipement: 500000,  // DZD
        vehicules: 0
      },
      equipements: {
        vehicules: 0,
        ordinateurs: 3,
        telephones: 3,
        outillages: 0
      }
    },
    { 
      id: '2', 
      nom: 'Technique', 
      responsable: '2',
      description: 'Expertise en systèmes de réfrigération',
      objectifs: ['Optimisation des interventions', 'Développement durable'],
      effectifCible: 5,
      budget: {
        formation: 2500000, // DZD
        equipement: 5000000, // DZD
        vehicules: 7500000  // DZD
      },
      equipements: {
        vehicules: 4,
        ordinateurs: 5,
        telephones: 5,
        outillages: 15
      },
      zonesIntervention: ['Alger', 'Blida', 'Tipaza'],
      astreintes: true
    },
    { 
      id: '3', 
      nom: 'Commercial', 
      responsable: '3',
      description: 'Développement commercial et relation client',
      objectifs: ['Croissance du CA', 'Satisfaction client'],
      effectifCible: 4,
      budget: {
        formation: 2000000, // DZD
        equipement: 1000000, // DZD
        vehicules: 4000000  // DZD
      },
      equipements: {
        vehicules: 3,
        ordinateurs: 4,
        telephones: 4,
        outillages: 0
      },
      zonesIntervention: ['Alger', 'Oran', 'Constantine']
    }
  ]);

  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: '1',
      client: 'Supermarché Express',
      adresse: '15 rue du Commerce, Alger Centre',
      type: 'maintenance',
      description: 'Maintenance préventive des systèmes de réfrigération',
      dureeEstimee: 3,
      priorite: 'normale',
      status: 'planifiee',
      materielUtilise: ['Fluide R-410A', 'Filtres', 'Joints']
    },
    {
      id: '2',
      client: 'Restaurant Le Gourmet',
      adresse: '8 avenue des Martyrs, Alger',
      type: 'depannage',
      description: 'Panne chambre froide',
      dureeEstimee: 2,
      priorite: 'urgente',
      status: 'en-cours',
      materielUtilise: ['Compresseur', 'Fluide R-404A']
    }
  ]);

  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [selectedDepartement, setSelectedDepartement] = useState<string>('tous');
  const [vue, setVue] = useState<'liste' | 'statistiques' | 'interventions'>('liste');
  const [selectedEmploye, setSelectedEmploye] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddInterventionForm, setShowAddInterventionForm] = useState(false);
  const [editingPointageId, setEditingPointageId] = useState<string | null>(null);
  const [editedPointage, setEditedPointage] = useState<Pointage | null>(null);

    const handleAddEmploye = (newEmploye: Employe) => {
    setEmployes([...employes, newEmploye]);
    setShowAddForm(false);
  };

  const handleAddIntervention = (newIntervention: Intervention) => {
    setInterventions([...interventions, newIntervention]);
    setShowAddInterventionForm(false);
  };

  const handlePointage = (employeId: string) => {
    const dernierPointage = pointages
      .filter(p => p.employeId === employeId)
      .sort((a, b) => b.dateEntree.getTime() - a.dateEntree.getTime())[0];
  if (!dernierPointage || dernierPointage.dateSortie) {
    setPointages([...pointages, {
      id: Date.now().toString(),
      employeId,
      dateEntree: new Date(),
      dateSortie: null,
      type: 'entrée',
      localisation: 'Bureau principal',
      typeJournee: 'normal',
      heuresPrevues: 8,
      kilometrage: 0,
      interventions: []
    }]);
  } else {
    const baseKilometrage = dernierPointage.kilometrage || 0;
    const additionalKilometrage = Math.floor(Math.random() * 50 + 10);
    
    setPointages(pointages.map(p => 
      p.id === dernierPointage.id 
        ? { 
            ...p, 
            dateSortie: new Date(), 
            type: 'sortie',
            kilometrage: baseKilometrage + additionalKilometrage
          }
        : p
    ));
  }
};

  const getStatutEmploye = (employeId: string) => {
    const employe = employes.find(e => e.id === employeId);
    if (employe?.statut !== 'actif') {
      return employe?.statut.charAt(0).toUpperCase() + employe?.statut.slice(1);
    }

    const dernierPointage = pointages
      .filter(p => p.employeId === employeId)
      .sort((a, b) => b.dateEntree.getTime() - a.dateEntree.getTime())[0];

    if (!dernierPointage || dernierPointage.dateSortie) {
      return 'Absent';
    }

    const interventionEnCours = interventions.find(i => 
      i.status === 'en-cours' && 
      dernierPointage.interventions?.some(di => di.id === i.id)
    );

    return interventionEnCours ? 'En intervention' : 'Présent';
  };

  const getStatistiques = () => {
    const present = employes.filter(e => getStatutEmploye(e.id) === 'Présent').length;
    const absent = employes.filter(e => getStatutEmploye(e.id) === 'Absent').length;
    const mission = employes.filter(e => getStatutEmploye(e.id) === 'Mission').length;
    const conge = employes.filter(e => getStatutEmploye(e.id) === 'Congé').length;
    const intervention = employes.filter(e => getStatutEmploye(e.id) === 'En intervention').length;
    return { present, absent, mission, conge, intervention };
  };

  const getStatistiquesDepartement = (departementId: string): Statistiques => {
    const dept = departements.find(d => d.id === departementId);
    const deptEmployes = employes.filter(e => e.departement === dept?.nom);
    
    const interventionsStats = {
      total: interventions.length,
      maintenance: interventions.filter(i => i.type === 'maintenance').length,
      depannage: interventions.filter(i => i.type === 'depannage').length,
      installation: interventions.filter(i => i.type === 'installation').length
    };

    const kilometrageTotal = pointages
      .filter(p => deptEmployes.some(e => e.id === p.employeId))
      .reduce((acc, p) => acc + (p.kilometrage || 0), 0);
    
    return {
      tauxPresence: (deptEmployes.filter(e => getStatutEmploye(e.id) === 'Présent').length / deptEmployes.length) * 100,
      heuresTravaillees: pointages
        .filter(p => deptEmployes.some(e => e.id === p.employeId) && p.dateSortie)
        .reduce((acc, p) => acc + (p.dateSortie ? (p.dateSortie.getTime() - p.dateEntree.getTime()) / (1000 * 60 * 60) : 0), 0),
      retards: pointages
        .filter(p => deptEmployes.some(e => e.id === p.employeId))
        .filter(p => {
          const employe = employes.find(e => e.id === p.employeId);
          if (!employe?.horaires) return false;
          const [heures, minutes] = employe.horaires.debut.split(':').map(Number);
          const debutPrevu = new Date(p.dateEntree);
          debutPrevu.setHours(heures, minutes, 0);
          return p.dateEntree.getTime() > debutPrevu.getTime() + 10 * 60 * 1000; // 10 minutes de tolérance
        }).length,
      depassements: pointages
        .filter(p => deptEmployes.some(e => e.id === p.employeId) && p.dateSortie)
        .filter(p => (p.dateSortie!.getTime() - p.dateEntree.getTime()) / (1000 * 60 * 60) > 10).length,
      interventions: interventionsStats,
      kilometrage: kilometrageTotal,
      tauxSatisfactionClient: 92,
      delaiMoyenIntervention: 45
    };
  };

  const filteredEmployes = selectedDepartement === 'tous'
    ? employes
    : employes.filter(e => e.departement === selectedDepartement);

  const formatDuree = (dateEntree: Date, dateSortie: Date | null) => {
    if (!dateSortie) return '';
    const diff = Math.floor((dateSortie.getTime() - dateEntree.getTime()) / (1000 * 60));
    const heures = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${heures}h${minutes.toString().padStart(2, '0')}`;
  };

  const getStatutClass = (statut: string) => {
    const classes = {
      'Présent': 'bg-green-100 text-green-800',
      'Absent': 'bg-red-100 text-red-800',
      'Mission': 'bg-blue-100 text-blue-800',
      'Congé': 'bg-yellow-100 text-yellow-800',
      'Formation': 'bg-purple-100 text-purple-800',
      'En intervention': 'bg-indigo-100 text-indigo-800',
      'Maladie': 'bg-orange-100 text-orange-800'
    };
    return classes[statut as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 }
  });

    const handleEditPointage = (pointage: Pointage) => {
    setEditingPointageId(pointage.id);
    setEditedPointage({ ...pointage });
  };

  const handleCancelEdit = () => {
    setEditingPointageId(null);
    setEditedPointage(null);
  };

  const handleSavePointage = (updatedPointage: Pointage) => {
    setPointages(pointages.map(p => p.id === updatedPointage.id ? updatedPointage : p));
    setEditingPointageId(null);
    setEditedPointage(null);
  };

  const handlePointageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editedPointage) {
      setEditedPointage({
        ...editedPointage,
        [name]: value
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const handleLogin = async (credentials: { email: string; password: string; id: string }) => {
    try {
      setIsLoading(true);
      setLoginError(null);
  
      if (!credentials.email || !credentials.id) {
        throw new Error('Veuillez remplir tous les champs');
      }
  
      // For demonstration, check if the credentials match any employee
      const employee = employes.find(e => 
        e.email.toLowerCase() === credentials.email.toLowerCase() && 
        e.id === credentials.id
      );
  
      if (employee) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', employee.id);
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add useEffect for authentication persistence
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    
    if (isAuth && userId && employes.some(e => e.id === userId)) {
      setIsAuthenticated(true);
    }
  }, []);
  
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <img src="/logo.png" alt="NEDJM Froid Logo" className="h-10 w-auto mr-3" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">NDEJM Froid</h1>
                <p className="text-sm opacity-90">Système de Pointage</p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <button 
                onClick={() => setVue('liste')}
                className={`p-2 sm:px-4 sm:py-2 rounded-lg transition-colors ${vue === 'liste' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'}`}
              >
                <Users className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVue('interventions')}
                className={`p-2 sm:px-4 sm:py-2 rounded-lg transition-colors ${vue === 'interventions' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'}`}
              >
                <Tool className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVue('statistiques')}
                className={`p-2 sm:px-4 sm:py-2 rounded-lg transition-colors ${vue === 'statistiques' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'}`}
              >
                <BarChart2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-4 sm:py-8 px-4">
        {vue === 'liste' ? (
          <>
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <h2 className="text-lg sm:text-xl font-semibold">Filtrer par département:</h2>
                <select 
                  value={selectedDepartement}
                  onChange={(e) => setSelectedDepartement(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tous">Tous les départements</option>
                  {departements.map(dept => (
                    <option key={dept.id} value={dept.nom}>{dept.nom}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Ajouter un employé</span>
              </button>
            </div>
            {/* Rest of the component */}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;
