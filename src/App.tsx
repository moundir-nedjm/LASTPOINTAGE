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
      setPointages(pointages.map(p => 
        p.id === dernierPointage.id 
          ? { 
              ...p, 
              dateSortie: new Date(), 
              type: 'sortie',
              kilometrage: p.kilometrage || 0 + (Math.random() * 50 + 10)
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

  const handleLogin = (credentials: { email: string; password: string; id: string }) => {
    // For demonstration, check if the credentials match any employee
    const employee = employes.find(e => 
      e.email === credentials.email && 
      e.id === credentials.id
    );

    if (employee) {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants invalides');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-8 h-8 mr-2" />
              <div>
                <h1 className="text-2xl font-bold">NDEJM Froid</h1>
                <p className="text-sm opacity-90">Système de Pointage</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setVue('liste')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  vue === 'liste' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                }`}
              >
                <Users className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVue('interventions')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  vue === 'interventions' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                }`}
              >
                <Tool className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVue('statistiques')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  vue === 'statistiques' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'
                }`}
              >
                <BarChart2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {vue === 'liste' ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Filtrer par département:</h2>
                <select 
                  value={selectedDepartement}
                  onChange={(e) => setSelectedDepartement(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="tous">Tous les départements</option>
                  {departements.map(dept => (
                    <option key={dept.id} value={dept.nom}>{dept.nom}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Présent: {getStatistiques().present}</span>
                </div>
                <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Absent: {getStatistiques().absent}</span>
                </div>
                 <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>En congé: {getStatistiques().conge}</span>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>En mission: {getStatistiques().mission}</span>
                </div>
                <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span>En intervention: {getStatistiques().intervention}</span>
                </div>
              </div>
            </div>

             <div className="mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter un employé
              </button>
            </div>

            {showAddForm && (
              <div className="mb-8">
                <AddEmployeeForm onAddEmploye={handleAddEmploye} departements={departements.map(d => d.nom)}/>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Liste des employés</h2>
                </div>
                <div className="space-y-4">
                  {filteredEmployes.map(employe => (
                    <animated.div 
                      key={employe.id} 
                      style={fadeIn}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEmploye(selectedEmploye === employe.id ? null : employe.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserCircle className="w-12 h-12 text-gray-400 mr-3" />
                          <div>
                            <h3 className="font-medium">{employe.prenom} {employe.nom}</h3>
                            <p className="text-sm text-gray-600">{employe.poste}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>{employe.departement}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm mr-3 ${
                            getStatutClass(getStatutEmploye(employe.id))
                          }`}>
                            {getStatutEmploye(employe.id)}
                          </span>
                          {employe.statut === 'actif' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePointage(employe.id);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {getStatutEmploye(employe.id) === 'Présent' ? 'Dépointer' : 'Pointer'}
                            </button>
                          )}
                        </div>
                      </div>

                      {selectedEmploye === employe.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              <span>{employe.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>{employe.telephone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Embauché le {employe.dateEmbauche.toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock4 className="w-4 h-4 mr-2" />
                              <span>Horaire: {employe.horaires?.debut} - {employe.horaires?.fin}</span>
                            </div>
                            <div className="col-span-2">
                              <h4 className="font-medium mb-2">Compétences:</h4>
                              <div className="flex flex-wrap gap-2">
                                {employe.competences.map((comp, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {employe.certifications && (
                              <div className="col-span-2">
                                <h4 className="font-medium mb-2">Certifications:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {employe.certifications.map((cert, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {employe.vehiculeService && (
                              <div className="flex items-center text-gray-600">
                                <Car className="w-4 h-4 mr-2" />
                                <span>Véhicule de service</span>
                              </div>
                            )}
                            {employe.zoneIntervention && (
                              <div className="col-span-2">
                                <h4 className="font-medium mb-2">Zones d'intervention:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {employe.zoneIntervention.map((zone, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                      {zone}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </animated.div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Historique de pointage</h2>
                </div>
                <div className="space-y-3">
                  {pointages
                    .sort((a, b) => b.dateEntree.getTime() - a.dateEntree.getTime())
                    .map(pointage => {
                      const employe = employes.find(e => e.id === pointage.employeId);
                      return (
                        <div key={pointage.id} className="border-l-4 border-blue-600 pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {employe?.prenom} {employe?.nom}
                              </p>
                              {editingPointageId === pointage.id ? (
                                <>
                                  <label htmlFor="dateEntree" className="block text-sm font-medium text-gray-700">Date d'entrée:</label>
                                  <input
                                    type="datetime-local"
                                    name="dateEntree"
                                    id="dateEntree"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    value={editedPointage?.dateEntree ? new Date(editedPointage.dateEntree).toISOString().slice(0, 16) : ''}
                                    onChange={handlePointageChange}
                                  />
                                  <label htmlFor="dateSortie" className="block text-sm font-medium text-gray-700">Date de sortie:</label>
                                  <input
                                    type="datetime-local"
                                    name="dateSortie"
                                    id="dateSortie"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    value={editedPointage?.dateSortie ? new Date(editedPointage.dateSortie).toISOString().slice(0, 16) : ''}
                                    onChange={handlePointageChange}
                                  />
                                  <label htmlFor="typeJournee" className="block text-sm font-medium text-gray-700">Type de journée:</label>
                                  <select
                                    name="typeJournee"
                                    id="typeJournee"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    value={editedPointage?.typeJournee || 'normal'}
                                    onChange={handlePointageChange}
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="maladie">Maladie</option>
                                    <option value="conge">Congé</option>
                                  </select>
                                  <div className="mt-4">
                                    <button
                                      onClick={() => editedPointage && handleSavePointage(editedPointage)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                                    >
                                      Enregistrer
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-600">
                                    {pointage.type === 'entrée' ? 'Arrivée' : 'Départ'} : {' '}
                                    {new Date(pointage.dateEntree).toLocaleTimeString('fr-FR')}
                                    {pointage.dateSortie && (
                                      <>
                                        {' '}- Départ : {new Date(pointage.dateSortie).toLocaleTimeString('fr-FR')}
                                        {' '}({formatDuree(pointage.dateEntree, pointage.dateSortie)})
                                      </>
                                    )}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                                    <span className="text-sm text-gray-500">{pointage.localisation}</span>
                                    {pointage.typeJournee !== 'normal' && (
                                      <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                        {pointage.typeJournee}
                                      </span>
                                    )}
                                  </div>
                                  {pointage.kilometrage > 0 && (
                                    <div className="flex items-center mt-1 text-sm text-gray-600">
                                      <Car className="w-4 h-4 mr-1" />
                                      <span>{Math.round(pointage.kilometrage)} km</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center">
                              {pointage.heuresPrevues && pointage.dateSortie && 
                               (pointage.dateSortie.getTime() - pointage.dateEntree.getTime()) / (1000 * 60 * 60) > pointage.heuresPrevues && (
                                <div className="flex items-center text-yellow-600 mr-2">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  <span className="text-sm">Heures supplémentaires</span>
                                </div>
                              )}
                              {editingPointageId !== pointage.id && (
                                <button                                  onClick={() => handleEditPointage(pointage)}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            </div>
          </>
        ) : vue === 'interventions' ? (
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Tool className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold">Interventions en cours</h2>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowAddInterventionForm(!showAddInterventionForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter une intervention
              </button>
            </div>

            {showAddInterventionForm && (
              <div className="mb-8">
                <AddInterventionForm
                  onAddIntervention={handleAddIntervention}
                  onCancel={() => setShowAddInterventionForm(false)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interventions.map(intervention => {
                const technicien = employes.find(e => 
                  e.departement === 'Technique' && 
                  pointages.some(p => 
                    p.employeId === e.id && 
                    !p.dateSortie && 
                    p.interventions?.some(i => i.id === intervention.id)
                  )
                );

                return (
                  <div key={intervention.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{intervention.client}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        intervention.priorite === 'urgente' 
                          ? 'bg-red-100 text-red-800' 
                          : intervention.priorite === 'haute'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {intervention.priorite.charAt(0).toUpperCase() + intervention.priorite.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                        <span className="text-sm text-gray-600">{intervention.adresse}</span>
                      </div>
                      <div className="flex items-center">
                        <Tool className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">{intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock4 className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Durée estimée:{intervention.dureeEstimee}h</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm text-gray-700">{intervention.description}</p>
                                            </div>
                      {intervention.materielUtilise && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {intervention.materielUtilise.map((materiel, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {materiel}
                            </span>
                          ))}
                        </div>
                      )}
                      {technicien && (
                        <div className="flex items-center mt-3 pt-3 border-t">
                          {technicien.photo ? (
                            <img 
                              src={technicien.photo}
                              alt={`${technicien.prenom}${technicien.nom}`}
                                                            className="w-8 h-8 rounded-full object-covermr-2"
                            />
                          ) : (
                            <UserCircle className="w-8 h-8 text-gray-400 mr-2" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{technicien.prenom} {technicien.nom}</p>
                            <p className="text-xs text-gray-500">{technicien.poste}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold">Statistiques de présence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {departements.map(dept => {
                const stats = getStatistiquesDepartement(dept.id);
                const deptEmployes = employes.filter(e => e.departement === dept.nom);
                const presents = deptEmployes.filter(e => getStatutEmploye(e.id) === 'Présent').length;
                const total = deptEmployes.length;

                return (
                  <div key={dept.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{dept.nom}</h3>
                      <span className="text-sm text-gray-500">
                        {total}/{dept.effectifCible} employés
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Présence:</span>
                          <span className="font-medium">{presents}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${stats.tauxPresence}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white p-2 rounded">
                          <span className="text-gray-600">Heures travaillées:</span>
                          <p className="font-medium">{Math.round(stats.heuresTravaillees)}h</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <span className="text-gray-600">Retards:</span>
                          <p className="font-medium">{stats.retards}</p>
                        </div>
                        {dept.nom === 'Technique' && (
                          <>
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-600">Interventions:</span>
                              <p className="font-medium">{stats.interventions.total}</p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-600">Km parcourus:</span>
                              <p className="font-medium">{Math.round(stats.kilometrage)} km</p>
                            </div>
                          </>
                        )}
                      </div>

                      {dept.budget && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Budget annuel:</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Formation:</span>
                              <span>{dept.budget.formation.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Équipement:</span>
                              <span>{dept.budget.equipement.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Véhicules:</span>
                              <span>{dept.budget.vehicules.toLocaleString()} DZD</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {dept.equipements && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Équipement:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {dept.equipements.vehicules > 0 && (
                              <div className="flex items-center text-sm">
                                <Car className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{dept.equipements.vehicules} véhicules</span>
                              </div>
                            )}
                            {dept.equipements.outillages > 0 && (
                              <div className="flex items-center text-sm">
                                <Tool className="w-4 h-4 mr-1 text-gray-500" />
                                <span>{dept.equipements.outillages} outils</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
