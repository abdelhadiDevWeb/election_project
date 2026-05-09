"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ElectionScope = "national" | "wilaya" | "commun";

interface DataContextType {
  wilayasData: any[];
  setWilayasData: React.Dispatch<React.SetStateAction<any[]>>;
  communesData: any[];
  setCommunesData: React.Dispatch<React.SetStateAction<any[]>>;
  centersData: any[];
  setCentersData: React.Dispatch<React.SetStateAction<any[]>>;
  desksData: any[];
  setDesksData: React.Dispatch<React.SetStateAction<any[]>>;
  partiesData: any[];
  setPartiesData: React.Dispatch<React.SetStateAction<any[]>>;
  candidatesData: any[];
  setCandidatesData: React.Dispatch<React.SetStateAction<any[]>>;
  adminsData: any[];
  setAdminsData: React.Dispatch<React.SetStateAction<any[]>>;
  membersData: any[];
  setMembersData: React.Dispatch<React.SetStateAction<any[]>>;
  observersData: any[];
  setObserversData: React.Dispatch<React.SetStateAction<any[]>>;
  electionScope: ElectionScope;
  setElectionScope: (scope: ElectionScope) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [wilayasData, setWilayasData] = useState([
  {
    "id": 1,
    "name": "Adrar",
    "num_wilaya": "01",
    "seats_count": 18,
    "communes": 16,
    "centers": 64,
    "desks": 320
  },
  {
    "id": 2,
    "name": "Chlef",
    "num_wilaya": "02",
    "seats_count": 10,
    "communes": 35,
    "centers": 140,
    "desks": 700
  },
  {
    "id": 3,
    "name": "Laghouat",
    "num_wilaya": "03",
    "seats_count": 11,
    "communes": 23,
    "centers": 92,
    "desks": 460
  },
  {
    "id": 4,
    "name": "Oum El Bouaghi",
    "num_wilaya": "04",
    "seats_count": 13,
    "communes": 29,
    "centers": 116,
    "desks": 580
  },
  {
    "id": 5,
    "name": "Batna",
    "num_wilaya": "05",
    "seats_count": 19,
    "communes": 60,
    "centers": 240,
    "desks": 1200
  },
  {
    "id": 6,
    "name": "Béjaïa",
    "num_wilaya": "06",
    "seats_count": 27,
    "communes": 52,
    "centers": 208,
    "desks": 1040
  },
  {
    "id": 7,
    "name": "Biskra",
    "num_wilaya": "07",
    "seats_count": 13,
    "communes": 26,
    "centers": 104,
    "desks": 520
  },
  {
    "id": 8,
    "name": "Béchar",
    "num_wilaya": "08",
    "seats_count": 12,
    "communes": 12,
    "centers": 48,
    "desks": 240
  },
  {
    "id": 9,
    "name": "Blida",
    "num_wilaya": "09",
    "seats_count": 13,
    "communes": 25,
    "centers": 100,
    "desks": 500
  },
  {
    "id": 10,
    "name": "Bouira",
    "num_wilaya": "10",
    "seats_count": 27,
    "communes": 45,
    "centers": 180,
    "desks": 900
  },
  {
    "id": 11,
    "name": "Tamanrasset",
    "num_wilaya": "11",
    "seats_count": 10,
    "communes": 5,
    "centers": 20,
    "desks": 100
  },
  {
    "id": 12,
    "name": "Tébessa",
    "num_wilaya": "12",
    "seats_count": 25,
    "communes": 27,
    "centers": 108,
    "desks": 540
  },
  {
    "id": 13,
    "name": "Tlemcen",
    "num_wilaya": "13",
    "seats_count": 16,
    "communes": 52,
    "centers": 208,
    "desks": 1040
  },
  {
    "id": 14,
    "name": "Tiaret",
    "num_wilaya": "14",
    "seats_count": 17,
    "communes": 41,
    "centers": 164,
    "desks": 820
  },
  {
    "id": 15,
    "name": "Tizi Ouzou",
    "num_wilaya": "15",
    "seats_count": 22,
    "communes": 67,
    "centers": 268,
    "desks": 1340
  },
  {
    "id": 16,
    "name": "Alger",
    "num_wilaya": "16",
    "seats_count": 23,
    "communes": 57,
    "centers": 228,
    "desks": 1140
  },
  {
    "id": 17,
    "name": "Djelfa",
    "num_wilaya": "17",
    "seats_count": 8,
    "communes": 34,
    "centers": 136,
    "desks": 680
  },
  {
    "id": 18,
    "name": "Jijel",
    "num_wilaya": "18",
    "seats_count": 19,
    "communes": 28,
    "centers": 112,
    "desks": 560
  },
  {
    "id": 19,
    "name": "Sétif",
    "num_wilaya": "19",
    "seats_count": 25,
    "communes": 60,
    "centers": 240,
    "desks": 1200
  },
  {
    "id": 20,
    "name": "Saïda",
    "num_wilaya": "20",
    "seats_count": 18,
    "communes": 16,
    "centers": 64,
    "desks": 320
  },
  {
    "id": 21,
    "name": "Skikda",
    "num_wilaya": "21",
    "seats_count": 11,
    "communes": 38,
    "centers": 152,
    "desks": 760
  },
  {
    "id": 22,
    "name": "Sidi Bel Abbès",
    "num_wilaya": "22",
    "seats_count": 18,
    "communes": 52,
    "centers": 208,
    "desks": 1040
  },
  {
    "id": 23,
    "name": "Annaba",
    "num_wilaya": "23",
    "seats_count": 13,
    "communes": 12,
    "centers": 48,
    "desks": 240
  },
  {
    "id": 24,
    "name": "Guelma",
    "num_wilaya": "24",
    "seats_count": 17,
    "communes": 34,
    "centers": 136,
    "desks": 680
  },
  {
    "id": 25,
    "name": "Constantine",
    "num_wilaya": "25",
    "seats_count": 27,
    "communes": 12,
    "centers": 48,
    "desks": 240
  },
  {
    "id": 26,
    "name": "Médéa",
    "num_wilaya": "26",
    "seats_count": 18,
    "communes": 63,
    "centers": 252,
    "desks": 1260
  },
  {
    "id": 27,
    "name": "Mostaganem",
    "num_wilaya": "27",
    "seats_count": 25,
    "communes": 32,
    "centers": 128,
    "desks": 640
  },
  {
    "id": 28,
    "name": "M'Sila",
    "num_wilaya": "28",
    "seats_count": 20,
    "communes": 46,
    "centers": 184,
    "desks": 920
  },
  {
    "id": 29,
    "name": "Mascara",
    "num_wilaya": "29",
    "seats_count": 20,
    "communes": 47,
    "centers": 188,
    "desks": 940
  },
  {
    "id": 30,
    "name": "Ouargla",
    "num_wilaya": "30",
    "seats_count": 23,
    "communes": 8,
    "centers": 32,
    "desks": 160
  },
  {
    "id": 31,
    "name": "Oran",
    "num_wilaya": "31",
    "seats_count": 26,
    "communes": 26,
    "centers": 104,
    "desks": 520
  },
  {
    "id": 32,
    "name": "El Bayadh",
    "num_wilaya": "32",
    "seats_count": 22,
    "communes": 21,
    "centers": 84,
    "desks": 420
  },
  {
    "id": 33,
    "name": "Illizi",
    "num_wilaya": "33",
    "seats_count": 20,
    "communes": 4,
    "centers": 16,
    "desks": 80
  },
  {
    "id": 34,
    "name": "Bordj Bou Arreridj",
    "num_wilaya": "34",
    "seats_count": 21,
    "communes": 34,
    "centers": 136,
    "desks": 680
  },
  {
    "id": 35,
    "name": "Boumerdès",
    "num_wilaya": "35",
    "seats_count": 23,
    "communes": 32,
    "centers": 128,
    "desks": 640
  },
  {
    "id": 36,
    "name": "El Tarf",
    "num_wilaya": "36",
    "seats_count": 26,
    "communes": 24,
    "centers": 96,
    "desks": 480
  },
  {
    "id": 37,
    "name": "Tindouf",
    "num_wilaya": "37",
    "seats_count": 11,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 38,
    "name": "Tissemsilt",
    "num_wilaya": "38",
    "seats_count": 22,
    "communes": 22,
    "centers": 88,
    "desks": 440
  },
  {
    "id": 39,
    "name": "El Oued",
    "num_wilaya": "39",
    "seats_count": 19,
    "communes": 22,
    "centers": 88,
    "desks": 440
  },
  {
    "id": 40,
    "name": "Khenchela",
    "num_wilaya": "40",
    "seats_count": 25,
    "communes": 21,
    "centers": 84,
    "desks": 420
  },
  {
    "id": 41,
    "name": "Souk Ahras",
    "num_wilaya": "41",
    "seats_count": 25,
    "communes": 26,
    "centers": 104,
    "desks": 520
  },
  {
    "id": 42,
    "name": "Tipaza",
    "num_wilaya": "42",
    "seats_count": 13,
    "communes": 28,
    "centers": 112,
    "desks": 560
  },
  {
    "id": 43,
    "name": "Mila",
    "num_wilaya": "43",
    "seats_count": 15,
    "communes": 32,
    "centers": 128,
    "desks": 640
  },
  {
    "id": 44,
    "name": "Aïn Defla",
    "num_wilaya": "44",
    "seats_count": 13,
    "communes": 36,
    "centers": 144,
    "desks": 720
  },
  {
    "id": 45,
    "name": "Naâma",
    "num_wilaya": "45",
    "seats_count": 16,
    "communes": 12,
    "centers": 48,
    "desks": 240
  },
  {
    "id": 46,
    "name": "Aïn Témouchent",
    "num_wilaya": "46",
    "seats_count": 12,
    "communes": 28,
    "centers": 112,
    "desks": 560
  },
  {
    "id": 47,
    "name": "Ghardaïa",
    "num_wilaya": "47",
    "seats_count": 14,
    "communes": 10,
    "centers": 40,
    "desks": 200
  },
  {
    "id": 48,
    "name": "Relizane",
    "num_wilaya": "48",
    "seats_count": 27,
    "communes": 38,
    "centers": 152,
    "desks": 760
  },
  {
    "id": 49,
    "name": "Timimoun",
    "num_wilaya": "49",
    "seats_count": 23,
    "communes": 10,
    "centers": 40,
    "desks": 200
  },
  {
    "id": 50,
    "name": "Bordj Badji Mokhtar",
    "num_wilaya": "50",
    "seats_count": 11,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 51,
    "name": "Ouled Djellal",
    "num_wilaya": "51",
    "seats_count": 9,
    "communes": 6,
    "centers": 24,
    "desks": 120
  },
  {
    "id": 52,
    "name": "Béni Abbès",
    "num_wilaya": "52",
    "seats_count": 21,
    "communes": 9,
    "centers": 36,
    "desks": 180
  },
  {
    "id": 53,
    "name": "In Salah",
    "num_wilaya": "53",
    "seats_count": 8,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 54,
    "name": "In Guezzam",
    "num_wilaya": "54",
    "seats_count": 9,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 55,
    "name": "Touggourt",
    "num_wilaya": "55",
    "seats_count": 16,
    "communes": 13,
    "centers": 52,
    "desks": 260
  },
  {
    "id": 56,
    "name": "Djanet",
    "num_wilaya": "56",
    "seats_count": 13,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 57,
    "name": "El Meghaier",
    "num_wilaya": "57",
    "seats_count": 14,
    "communes": 8,
    "centers": 32,
    "desks": 160
  },
  {
    "id": 58,
    "name": "El Menia",
    "num_wilaya": "58",
    "seats_count": 21,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 59,
    "name": "Aflou",
    "num_wilaya": "59",
    "seats_count": 12,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 60,
    "name": "Barika",
    "num_wilaya": "60",
    "seats_count": 17,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 61,
    "name": "Ksar Chellala",
    "num_wilaya": "61",
    "seats_count": 20,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 62,
    "name": "Messaad",
    "num_wilaya": "62",
    "seats_count": 15,
    "communes": 5,
    "centers": 20,
    "desks": 100
  },
  {
    "id": 63,
    "name": "Aïn Oussera",
    "num_wilaya": "63",
    "seats_count": 23,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 64,
    "name": "Boussaâda",
    "num_wilaya": "64",
    "seats_count": 14,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 65,
    "name": "El Abiodh Sidi Cheikh",
    "num_wilaya": "65",
    "seats_count": 9,
    "communes": 1,
    "centers": 4,
    "desks": 20
  },
  {
    "id": 66,
    "name": "El Kantara",
    "num_wilaya": "66",
    "seats_count": 16,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 67,
    "name": "Bir El Ater",
    "num_wilaya": "67",
    "seats_count": 18,
    "communes": 2,
    "centers": 8,
    "desks": 40
  },
  {
    "id": 68,
    "name": "Ksar El Boukhari",
    "num_wilaya": "68",
    "seats_count": 13,
    "communes": 3,
    "centers": 12,
    "desks": 60
  },
  {
    "id": 69,
    "name": "El Aricha",
    "num_wilaya": "69",
    "seats_count": 16,
    "communes": 2,
    "centers": 8,
    "desks": 40
  }
]);;

  const [communesData, setCommunesData] = useState([
  {
    "id": 1,
    "name": "Timekten",
    "num_bladia": "22",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 2,
    "name": "Bouda",
    "num_bladia": "06",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 3,
    "name": "Ouled Ahmed Timmi",
    "num_bladia": "13",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 4,
    "name": "Adrar",
    "num_bladia": "01",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 5,
    "name": "Fenoughil",
    "num_bladia": "09",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 6,
    "name": "In Zghmir",
    "num_bladia": "10",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 7,
    "name": "Reggane",
    "num_bladia": "16",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 8,
    "name": "Sali",
    "num_bladia": "17",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 9,
    "name": "Sebaa",
    "num_bladia": "18",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 10,
    "name": "Tsabit",
    "num_bladia": "27",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 11,
    "name": "Tamest",
    "num_bladia": "21",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 12,
    "name": "Tamantit",
    "num_bladia": "20",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 13,
    "name": "Tit",
    "num_bladia": "26",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 14,
    "name": "Zaouiet Kounta",
    "num_bladia": "28",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 15,
    "name": "Akabli",
    "num_bladia": "02",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 16,
    "name": "Aoulef",
    "num_bladia": "04",
    "wilaya": "Adrar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 17,
    "name": "Talassa",
    "num_bladia": "60",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 18,
    "name": "Zeboudja",
    "num_bladia": "63",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 19,
    "name": "El Hadjadj",
    "num_bladia": "41",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 20,
    "name": "Ouled Ben Abdelkader",
    "num_bladia": "52",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 21,
    "name": "Ain Merane",
    "num_bladia": "30",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 22,
    "name": "Breira",
    "num_bladia": "37",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 23,
    "name": "Ouled Abbes",
    "num_bladia": "51",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 24,
    "name": "Oued Fodda",
    "num_bladia": "48",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 25,
    "name": "Beni Rached",
    "num_bladia": "34",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 26,
    "name": "Herenfa",
    "num_bladia": "45",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 27,
    "name": "Tadjena",
    "num_bladia": "59",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 28,
    "name": "El Marsa",
    "num_bladia": "43",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 29,
    "name": "Chlef",
    "num_bladia": "39",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 30,
    "name": "Oum Drou",
    "num_bladia": "54",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 31,
    "name": "Sendjas",
    "num_bladia": "55",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 32,
    "name": "Sidi Abderrahmane",
    "num_bladia": "56",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 33,
    "name": "Sidi Akkacha",
    "num_bladia": "57",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 34,
    "name": "Tenes",
    "num_bladia": "62",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 35,
    "name": "Beni  Bouattab",
    "num_bladia": "32",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 36,
    "name": "El Karimia",
    "num_bladia": "42",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 37,
    "name": "Harchoun",
    "num_bladia": "44",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 38,
    "name": "Bouzeghaia",
    "num_bladia": "36",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 39,
    "name": "Taougrit",
    "num_bladia": "61",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 40,
    "name": "Beni Haoua",
    "num_bladia": "33",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 41,
    "name": "Abou El Hassane",
    "num_bladia": "29",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 42,
    "name": "Oued Goussine",
    "num_bladia": "49",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 43,
    "name": "Chettia",
    "num_bladia": "38",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 44,
    "name": "Moussadek",
    "num_bladia": "47",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 45,
    "name": "Ouled Fares",
    "num_bladia": "53",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 46,
    "name": "Boukadir",
    "num_bladia": "35",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 47,
    "name": "Oued Sly",
    "num_bladia": "50",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 48,
    "name": "Sobha",
    "num_bladia": "58",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 49,
    "name": "Benairia",
    "num_bladia": "31",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 50,
    "name": "Labiod Medjadja",
    "num_bladia": "46",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 51,
    "name": "Dahra",
    "num_bladia": "40",
    "wilaya": "Chlef",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 52,
    "name": "El Beidha",
    "num_bladia": "67",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 53,
    "name": "Gueltat Sidi Saad",
    "num_bladia": "73",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 54,
    "name": "Brida",
    "num_bladia": "69",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 55,
    "name": "Ain Sidi Ali",
    "num_bladia": "66",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 56,
    "name": "Tadjemout",
    "num_bladia": "85",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 57,
    "name": "Hadj Mechri",
    "num_bladia": "74",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 58,
    "name": "Taouiala",
    "num_bladia": "87",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 59,
    "name": "El Ghicha",
    "num_bladia": "71",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 60,
    "name": "Tadjrouna",
    "num_bladia": "86",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 61,
    "name": "Sebgag",
    "num_bladia": "82",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 62,
    "name": "Sidi Bouzid",
    "num_bladia": "83",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 63,
    "name": "Oued Morra",
    "num_bladia": "80",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 64,
    "name": "Laghouat",
    "num_bladia": "79",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 65,
    "name": "Oued M'zi",
    "num_bladia": "81",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 66,
    "name": "Ksar El Hirane",
    "num_bladia": "78",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 67,
    "name": "El Assafia",
    "num_bladia": "70",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 68,
    "name": "Sidi Makhlouf",
    "num_bladia": "84",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 69,
    "name": "Hassi Delaa",
    "num_bladia": "75",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 70,
    "name": "Hassi R'mel",
    "num_bladia": "76",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 71,
    "name": "Ain Madhi",
    "num_bladia": "65",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 72,
    "name": "El Haouaita",
    "num_bladia": "72",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 73,
    "name": "Kheneg",
    "num_bladia": "77",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 74,
    "name": "Benacer Benchohra",
    "num_bladia": "68",
    "wilaya": "Laghouat",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 75,
    "name": "Fkirina",
    "num_bladia": "104",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 76,
    "name": "El Fedjoudj Boughrara Sa",
    "num_bladia": "102",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 77,
    "name": "Ain Fekroun",
    "num_bladia": "91",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 78,
    "name": "Rahia",
    "num_bladia": "113",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 79,
    "name": "Meskiana",
    "num_bladia": "107",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 80,
    "name": "El Belala",
    "num_bladia": "100",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 81,
    "name": "Behir Chergui",
    "num_bladia": "95",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 82,
    "name": "Ksar Sbahi",
    "num_bladia": "106",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 83,
    "name": "Souk Naamane",
    "num_bladia": "115",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 84,
    "name": "Ouled Zouai",
    "num_bladia": "111",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 85,
    "name": "Oum El Bouaghi",
    "num_bladia": "112",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 86,
    "name": "Ain Babouche",
    "num_bladia": "88",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 87,
    "name": "Ain Zitoun",
    "num_bladia": "94",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 88,
    "name": "Bir Chouhada",
    "num_bladia": "97",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 89,
    "name": "Ain Beida",
    "num_bladia": "89",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 90,
    "name": "Berriche",
    "num_bladia": "96",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 91,
    "name": "Zorg",
    "num_bladia": "116",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 92,
    "name": "Ain M'lila",
    "num_bladia": "93",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 93,
    "name": "Ouled Gacem",
    "num_bladia": "109",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 94,
    "name": "Ouled Hamla",
    "num_bladia": "110",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 95,
    "name": "El Amiria",
    "num_bladia": "99",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 96,
    "name": "Sigus",
    "num_bladia": "114",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 97,
    "name": "Oued Nini",
    "num_bladia": "108",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 98,
    "name": "Ain Diss",
    "num_bladia": "90",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 99,
    "name": "Dhalaa",
    "num_bladia": "98",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 100,
    "name": "El Djazia",
    "num_bladia": "101",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 101,
    "name": "Ain Kercha",
    "num_bladia": "92",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 102,
    "name": "El Harmilia",
    "num_bladia": "103",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 103,
    "name": "Hanchir Toumghani",
    "num_bladia": "105",
    "wilaya": "Oum El Bouaghi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 104,
    "name": "Maafa",
    "num_bladia": "150",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 105,
    "name": "Gosbat",
    "num_bladia": "139",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 106,
    "name": "Timgad",
    "num_bladia": "176",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 107,
    "name": "Taxlent",
    "num_bladia": "170",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 108,
    "name": "Ouled Si Slimane",
    "num_bladia": "161",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 109,
    "name": "Lemcene",
    "num_bladia": "148",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 110,
    "name": "Talkhamt",
    "num_bladia": "169",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 111,
    "name": "Ras El Aioun",
    "num_bladia": "164",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 112,
    "name": "Rahbat",
    "num_bladia": "163",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 113,
    "name": "Ouled Sellem",
    "num_bladia": "160",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 114,
    "name": "Guigba",
    "num_bladia": "140",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 115,
    "name": "Teniet El Abed",
    "num_bladia": "172",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 116,
    "name": "Batna",
    "num_bladia": "123",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 117,
    "name": "Fesdis",
    "num_bladia": "136",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 118,
    "name": "Oued Chaaba",
    "num_bladia": "154",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 119,
    "name": "Hidoussa",
    "num_bladia": "141",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 120,
    "name": "Ksar Bellezma",
    "num_bladia": "145",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 121,
    "name": "Merouana",
    "num_bladia": "152",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 122,
    "name": "Oued El Ma",
    "num_bladia": "155",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 123,
    "name": "Lazrou",
    "num_bladia": "147",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 124,
    "name": "Seriana",
    "num_bladia": "167",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 125,
    "name": "Zanet El Beida",
    "num_bladia": "177",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 126,
    "name": "Menaa",
    "num_bladia": "151",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 127,
    "name": "Tigharghar",
    "num_bladia": "174",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 128,
    "name": "Ain Yagout",
    "num_bladia": "119",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 129,
    "name": "Boumia",
    "num_bladia": "128",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 130,
    "name": "Djerma",
    "num_bladia": "132",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 131,
    "name": "El Madher",
    "num_bladia": "135",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 132,
    "name": "Ouyoun El Assafir",
    "num_bladia": "162",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 133,
    "name": "Tazoult",
    "num_bladia": "171",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 134,
    "name": "Boumagueur",
    "num_bladia": "127",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 135,
    "name": "N Gaous",
    "num_bladia": "153",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 136,
    "name": "Sefiane",
    "num_bladia": "165",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 137,
    "name": "Arris",
    "num_bladia": "120",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 138,
    "name": "Tighanimine",
    "num_bladia": "173",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 139,
    "name": "Ain Djasser",
    "num_bladia": "117",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 140,
    "name": "El Hassi",
    "num_bladia": "134",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 141,
    "name": "Seggana",
    "num_bladia": "166",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 142,
    "name": "Tilatou",
    "num_bladia": "175",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 143,
    "name": "Foum Toub",
    "num_bladia": "137",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 144,
    "name": "Ichemoul",
    "num_bladia": "142",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 145,
    "name": "Inoughissen",
    "num_bladia": "143",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 146,
    "name": "Bouzina",
    "num_bladia": "129",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 147,
    "name": "Larbaa",
    "num_bladia": "146",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 148,
    "name": "Boulhilat",
    "num_bladia": "126",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 149,
    "name": "Chemora",
    "num_bladia": "130",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 150,
    "name": "Bitam",
    "num_bladia": "125",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 151,
    "name": "M Doukal",
    "num_bladia": "149",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 152,
    "name": "Azil Abedelkader",
    "num_bladia": "121",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 153,
    "name": "Djezzar",
    "num_bladia": "133",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 154,
    "name": "Ouled Ammar",
    "num_bladia": "157",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 155,
    "name": "Ghassira",
    "num_bladia": "138",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 156,
    "name": "Kimmel",
    "num_bladia": "144",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 157,
    "name": "T Kout",
    "num_bladia": "168",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 158,
    "name": "Ain Touta",
    "num_bladia": "118",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 159,
    "name": "Beni Foudhala El Hakania",
    "num_bladia": "124",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 160,
    "name": "Ouled Fadel",
    "num_bladia": "159",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 161,
    "name": "Ouled Aouf",
    "num_bladia": "158",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 162,
    "name": "Chir",
    "num_bladia": "131",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 163,
    "name": "Oued Taga",
    "num_bladia": "156",
    "wilaya": "Batna",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 164,
    "name": "Sidi Ayad",
    "num_bladia": "212",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 165,
    "name": "Barbacha",
    "num_bladia": "186",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 166,
    "name": "Leflaye",
    "num_bladia": "199",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 167,
    "name": "Kendira",
    "num_bladia": "206",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 168,
    "name": "Sidi-Aich",
    "num_bladia": "213",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 169,
    "name": "Tifra",
    "num_bladia": "225",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 170,
    "name": "Tinebdar",
    "num_bladia": "227",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 171,
    "name": "El Kseur",
    "num_bladia": "200",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 172,
    "name": "Fenaia Il Maten",
    "num_bladia": "201",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 173,
    "name": "Toudja",
    "num_bladia": "229",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 174,
    "name": "Dra El Caid",
    "num_bladia": "198",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 175,
    "name": "Kherrata",
    "num_bladia": "207",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 176,
    "name": "Bejaia",
    "num_bladia": "187",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 177,
    "name": "Oued Ghir",
    "num_bladia": "210",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 178,
    "name": "Benimaouche",
    "num_bladia": "191",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 179,
    "name": "Beni Djellil",
    "num_bladia": "188",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 180,
    "name": "Feraoun",
    "num_bladia": "202",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 181,
    "name": "Smaoun",
    "num_bladia": "214",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 182,
    "name": "Timezrit",
    "num_bladia": "226",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 183,
    "name": "Melbou",
    "num_bladia": "209",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 184,
    "name": "Souk El Tenine",
    "num_bladia": "215",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 185,
    "name": "Tamridjet",
    "num_bladia": "219",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 186,
    "name": "Boukhelifa",
    "num_bladia": "194",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 187,
    "name": "Tala Hamza",
    "num_bladia": "217",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 188,
    "name": "Tichy",
    "num_bladia": "224",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 189,
    "name": "Ait R'zine",
    "num_bladia": "179",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 190,
    "name": "Ighil-Ali",
    "num_bladia": "204",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 191,
    "name": "Ait-Smail",
    "num_bladia": "180",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 192,
    "name": "Darguina",
    "num_bladia": "197",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 193,
    "name": "Taskriout",
    "num_bladia": "221",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 194,
    "name": "Aokas",
    "num_bladia": "185",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 195,
    "name": "Tizi-N'berber",
    "num_bladia": "228",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 196,
    "name": "Adekar",
    "num_bladia": "178",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 197,
    "name": "Beni K'sila",
    "num_bladia": "189",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 198,
    "name": "Taourit Ighil",
    "num_bladia": "220",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 199,
    "name": "Akbou",
    "num_bladia": "181",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 200,
    "name": "Chellata",
    "num_bladia": "195",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 201,
    "name": "Ighram",
    "num_bladia": "205",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 202,
    "name": "Tamokra",
    "num_bladia": "218",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 203,
    "name": "Amalou",
    "num_bladia": "183",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 204,
    "name": "Bouhamza",
    "num_bladia": "193",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 205,
    "name": "M'cisna",
    "num_bladia": "208",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 206,
    "name": "Seddouk",
    "num_bladia": "211",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 207,
    "name": "Beni-Mallikeche",
    "num_bladia": "190",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 208,
    "name": "Boudjellil",
    "num_bladia": "192",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 209,
    "name": "Tazmalt",
    "num_bladia": "222",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 210,
    "name": "Akfadou",
    "num_bladia": "182",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 211,
    "name": "Chemini",
    "num_bladia": "196",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 212,
    "name": "Souk Oufella",
    "num_bladia": "216",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 213,
    "name": "Tibane",
    "num_bladia": "223",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 214,
    "name": "Ouzellaguen",
    "num_bladia": "203",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 215,
    "name": "Amizour",
    "num_bladia": "184",
    "wilaya": "Béjaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 216,
    "name": "El Feidh",
    "num_bladia": "241",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 217,
    "name": "Lichana",
    "num_bladia": "249",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 218,
    "name": "Bouchakroun",
    "num_bladia": "235",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 219,
    "name": "Mekhadma",
    "num_bladia": "252",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 220,
    "name": "Djemorah",
    "num_bladia": "239",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 221,
    "name": "Branis",
    "num_bladia": "236",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 222,
    "name": "El Outaya",
    "num_bladia": "246",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 223,
    "name": "Khenguet Sidi Nadji",
    "num_bladia": "248",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 224,
    "name": "Ain Zaatout",
    "num_bladia": "231",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 225,
    "name": "Zeribet El Oued",
    "num_bladia": "262",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 226,
    "name": "Meziraa",
    "num_bladia": "253",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 227,
    "name": "Biskra",
    "num_bladia": "233",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 228,
    "name": "El Hadjab",
    "num_bladia": "243",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 229,
    "name": "M'lili",
    "num_bladia": "254",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 230,
    "name": "Foughala",
    "num_bladia": "247",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 231,
    "name": "El Ghrous",
    "num_bladia": "242",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 232,
    "name": "Bordj Ben Azzouz",
    "num_bladia": "234",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 233,
    "name": "Ourlal",
    "num_bladia": "257",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 234,
    "name": "Oumache",
    "num_bladia": "256",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 235,
    "name": "Ain Naga",
    "num_bladia": "230",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 236,
    "name": "Chetma",
    "num_bladia": "238",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 237,
    "name": "El Haouch",
    "num_bladia": "244",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 238,
    "name": "Sidi Okba",
    "num_bladia": "260",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 239,
    "name": "M'chouneche",
    "num_bladia": "251",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 240,
    "name": "Lioua",
    "num_bladia": "250",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 241,
    "name": "Tolga",
    "num_bladia": "261",
    "wilaya": "Biskra",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 242,
    "name": "Bechar",
    "num_bladia": "264",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 243,
    "name": "Boukais",
    "num_bladia": "268",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 244,
    "name": "Lahmar",
    "num_bladia": "275",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 245,
    "name": "Mogheul",
    "num_bladia": "278",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 246,
    "name": "Meridja",
    "num_bladia": "277",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 247,
    "name": "Taghit",
    "num_bladia": "281",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 248,
    "name": "Abadla",
    "num_bladia": "263",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 249,
    "name": "Erg-Ferradj",
    "num_bladia": "270",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 250,
    "name": "Machraa-Houari-Boumediene",
    "num_bladia": "276",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 251,
    "name": "Beni-Ounif",
    "num_bladia": "267",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 252,
    "name": "Tabelbala",
    "num_bladia": "280",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 253,
    "name": "Kenadsa",
    "num_bladia": "272",
    "wilaya": "Béchar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 254,
    "name": "Beni Mered",
    "num_bladia": "285",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 255,
    "name": "Ouled Slama",
    "num_bladia": "305",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 256,
    "name": "Mouzaia",
    "num_bladia": "302",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 257,
    "name": "Hammam Elouane",
    "num_bladia": "299",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 258,
    "name": "Bougara",
    "num_bladia": "291",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 259,
    "name": "Souhane",
    "num_bladia": "307",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 260,
    "name": "Larbaa",
    "num_bladia": "300",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 261,
    "name": "Soumaa",
    "num_bladia": "308",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 262,
    "name": "Guerrouaou",
    "num_bladia": "298",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 263,
    "name": "Boufarik",
    "num_bladia": "290",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 264,
    "name": "Meftah",
    "num_bladia": "301",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 265,
    "name": "Chiffa",
    "num_bladia": "294",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 266,
    "name": "Ain Romana",
    "num_bladia": "284",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 267,
    "name": "Oued  Djer",
    "num_bladia": "303",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 268,
    "name": "El-Affroun",
    "num_bladia": "297",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 269,
    "name": "Ouled Yaich",
    "num_bladia": "306",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 270,
    "name": "Chrea",
    "num_bladia": "295",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 271,
    "name": "Djebabra",
    "num_bladia": "296",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 272,
    "name": "Oued El Alleug",
    "num_bladia": "304",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 273,
    "name": "Benkhelil",
    "num_bladia": "287",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 274,
    "name": "Beni-Tamou",
    "num_bladia": "286",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 275,
    "name": "Chebli",
    "num_bladia": "293",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 276,
    "name": "Bouinan",
    "num_bladia": "292",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 277,
    "name": "Bouarfa",
    "num_bladia": "289",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 278,
    "name": "Blida",
    "num_bladia": "288",
    "wilaya": "Blida",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 279,
    "name": "Ain Laloui",
    "num_bladia": "312",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 280,
    "name": "Hadjera Zerga",
    "num_bladia": "334",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 281,
    "name": "Mezdour",
    "num_bladia": "342",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 282,
    "name": "Taguedite",
    "num_bladia": "351",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 283,
    "name": "Ridane",
    "num_bladia": "346",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 284,
    "name": "Maamora",
    "num_bladia": "341",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 285,
    "name": "El-Hakimia",
    "num_bladia": "331",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 286,
    "name": "Ahl El Ksar",
    "num_bladia": "310",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 287,
    "name": "Dirah",
    "num_bladia": "325",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 288,
    "name": "Dechmia",
    "num_bladia": "324",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 289,
    "name": "Bechloul",
    "num_bladia": "317",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 290,
    "name": "Ath Mansour",
    "num_bladia": "352",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 291,
    "name": "Saharidj",
    "num_bladia": "347",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 292,
    "name": "El Adjiba",
    "num_bladia": "327",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 293,
    "name": "El Asnam",
    "num_bladia": "328",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 294,
    "name": "M Chedallah",
    "num_bladia": "339",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 295,
    "name": "Bordj Okhriss",
    "num_bladia": "319",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 296,
    "name": "Sour El Ghozlane",
    "num_bladia": "349",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 297,
    "name": "Hanif",
    "num_bladia": "336",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 298,
    "name": "Chorfa",
    "num_bladia": "323",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 299,
    "name": "Ouled Rached",
    "num_bladia": "344",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 300,
    "name": "Ain El Hadjar",
    "num_bladia": "311",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 301,
    "name": "Aghbalou",
    "num_bladia": "309",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 302,
    "name": "Raouraoua",
    "num_bladia": "345",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 303,
    "name": "El Khabouzia",
    "num_bladia": "330",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 304,
    "name": "Bir Ghbalou",
    "num_bladia": "318",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 305,
    "name": "Bouira",
    "num_bladia": "321",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 306,
    "name": "Ain Turk",
    "num_bladia": "313",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 307,
    "name": "Ait Laaziz",
    "num_bladia": "315",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 308,
    "name": "Ain-Bessem",
    "num_bladia": "314",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 309,
    "name": "El-Mokrani",
    "num_bladia": "332",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 310,
    "name": "Souk El Khemis",
    "num_bladia": "348",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 311,
    "name": "Aomar",
    "num_bladia": "316",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 312,
    "name": "Djebahia",
    "num_bladia": "326",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 313,
    "name": "El Hachimia",
    "num_bladia": "329",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 314,
    "name": "Haizer",
    "num_bladia": "335",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 315,
    "name": "Taghzout",
    "num_bladia": "350",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 316,
    "name": "Bouderbala",
    "num_bladia": "320",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 317,
    "name": "Boukram",
    "num_bladia": "322",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 318,
    "name": "Guerrouma",
    "num_bladia": "333",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 319,
    "name": "Lakhdaria",
    "num_bladia": "338",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 320,
    "name": "Maala",
    "num_bladia": "340",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 321,
    "name": "Kadiria",
    "num_bladia": "337",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 322,
    "name": "Z'barbar (El Isseri )",
    "num_bladia": "353",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 323,
    "name": "Oued El Berdi",
    "num_bladia": "343",
    "wilaya": "Bouira",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 324,
    "name": "Tazrouk",
    "num_bladia": "362",
    "wilaya": "Tamanrasset",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 325,
    "name": "Abelsa",
    "num_bladia": "354",
    "wilaya": "Tamanrasset",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 326,
    "name": "Tamanrasset",
    "num_bladia": "361",
    "wilaya": "Tamanrasset",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 327,
    "name": "Ain Amguel",
    "num_bladia": "355",
    "wilaya": "Tamanrasset",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 328,
    "name": "Idles",
    "num_bladia": "359",
    "wilaya": "Tamanrasset",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 329,
    "name": "El-Houidjbet",
    "num_bladia": "380",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 330,
    "name": "El-Aouinet",
    "num_bladia": "379",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 331,
    "name": "Ferkane",
    "num_bladia": "381",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 332,
    "name": "Negrine",
    "num_bladia": "385",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 333,
    "name": "Bir Mokkadem",
    "num_bladia": "368",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 334,
    "name": "Bir Dheheb",
    "num_bladia": "367",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 335,
    "name": "Saf Saf El Ouesra",
    "num_bladia": "388",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 336,
    "name": "Guorriguer",
    "num_bladia": "382",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 337,
    "name": "Bekkaria",
    "num_bladia": "366",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 338,
    "name": "Boulhaf Dyr",
    "num_bladia": "371",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 339,
    "name": "Oum Ali",
    "num_bladia": "387",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 340,
    "name": "Boukhadra",
    "num_bladia": "370",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 341,
    "name": "El Malabiod",
    "num_bladia": "374",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 342,
    "name": "Ouenza",
    "num_bladia": "386",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 343,
    "name": "El Meridj",
    "num_bladia": "375",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 344,
    "name": "Ain Zerga",
    "num_bladia": "364",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 345,
    "name": "Stah Guentis",
    "num_bladia": "389",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 346,
    "name": "El Ogla",
    "num_bladia": "377",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 347,
    "name": "El Mezeraa",
    "num_bladia": "376",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 348,
    "name": "Bedjene",
    "num_bladia": "365",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 349,
    "name": "Morsott",
    "num_bladia": "384",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 350,
    "name": "Telidjen",
    "num_bladia": "391",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 351,
    "name": "Cheria",
    "num_bladia": "372",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 352,
    "name": "El Ogla El Malha",
    "num_bladia": "378",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 353,
    "name": "Tebessa",
    "num_bladia": "390",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 354,
    "name": "Hammamet",
    "num_bladia": "383",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 355,
    "name": "El Kouif",
    "num_bladia": "373",
    "wilaya": "Tébessa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 356,
    "name": "Bab El Assa",
    "num_bladia": "400",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 357,
    "name": "Terny Beni Hediel",
    "num_bladia": "441",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 358,
    "name": "Mansourah",
    "num_bladia": "424",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 359,
    "name": "Beni Mester",
    "num_bladia": "404",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 360,
    "name": "Ain Ghoraba",
    "num_bladia": "394",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 361,
    "name": "Chetouane",
    "num_bladia": "411",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 362,
    "name": "Amieur",
    "num_bladia": "399",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 363,
    "name": "Ain Fezza",
    "num_bladia": "393",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 364,
    "name": "Honnaine",
    "num_bladia": "422",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 365,
    "name": "Beni Khellad",
    "num_bladia": "403",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 366,
    "name": "Sidi Djillali",
    "num_bladia": "436",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 367,
    "name": "Bouihi",
    "num_bladia": "410",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 368,
    "name": "Nedroma",
    "num_bladia": "427",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 369,
    "name": "M'sirda Fouaga",
    "num_bladia": "426",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 370,
    "name": "Marsa Ben M'hidi",
    "num_bladia": "425",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 371,
    "name": "Sidi Medjahed",
    "num_bladia": "437",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 372,
    "name": "Beni Boussaid",
    "num_bladia": "402",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 373,
    "name": "Sebdou",
    "num_bladia": "434",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 374,
    "name": "El Gor",
    "num_bladia": "417",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 375,
    "name": "Bouhlou",
    "num_bladia": "409",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 376,
    "name": "Maghnia",
    "num_bladia": "423",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 377,
    "name": "Hammam Boughrara",
    "num_bladia": "420",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 378,
    "name": "Zenata",
    "num_bladia": "444",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 379,
    "name": "Ouled Riyah",
    "num_bladia": "430",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 380,
    "name": "Hennaya",
    "num_bladia": "421",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 381,
    "name": "Sidi Abdelli",
    "num_bladia": "435",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 382,
    "name": "Souk Tleta",
    "num_bladia": "440",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 383,
    "name": "Bensekrane",
    "num_bladia": "408",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 384,
    "name": "Fellaoucene",
    "num_bladia": "418",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 385,
    "name": "Ain Kebira",
    "num_bladia": "395",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 386,
    "name": "Ain Fetah",
    "num_bladia": "392",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 387,
    "name": "Tlemcen",
    "num_bladia": "443",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 388,
    "name": "Ain Nehala",
    "num_bladia": "396",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 389,
    "name": "Ain Tellout",
    "num_bladia": "397",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 390,
    "name": "Ain Youcef",
    "num_bladia": "398",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 391,
    "name": "Beni Ouarsous",
    "num_bladia": "405",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 392,
    "name": "El Fehoul",
    "num_bladia": "416",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 393,
    "name": "Remchi",
    "num_bladia": "431",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 394,
    "name": "Sebbaa Chioukh",
    "num_bladia": "433",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 395,
    "name": "Souani",
    "num_bladia": "439",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 396,
    "name": "Sabra",
    "num_bladia": "432",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 397,
    "name": "Dar Yaghmoracen",
    "num_bladia": "412",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 398,
    "name": "Ghazaouet",
    "num_bladia": "419",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 399,
    "name": "Souahlia",
    "num_bladia": "438",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 400,
    "name": "Tianet",
    "num_bladia": "442",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 401,
    "name": "Beni Smiel",
    "num_bladia": "406",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 402,
    "name": "Oued Lakhdar",
    "num_bladia": "428",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 403,
    "name": "Ouled Mimoun",
    "num_bladia": "429",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 404,
    "name": "Beni Bahdel",
    "num_bladia": "401",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 405,
    "name": "Beni Snous",
    "num_bladia": "407",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 406,
    "name": "Azail",
    "num_bladia": "415",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 407,
    "name": "Djebala",
    "num_bladia": "413",
    "wilaya": "Tlemcen",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 408,
    "name": "Mahdia",
    "num_bladia": "461",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 409,
    "name": "Ain Dzarit",
    "num_bladia": "447",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 410,
    "name": "Sebaine",
    "num_bladia": "472",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 411,
    "name": "Faidja",
    "num_bladia": "455",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 412,
    "name": "Si Abdelghani",
    "num_bladia": "475",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 413,
    "name": "Sougueur",
    "num_bladia": "480",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 414,
    "name": "Tousnina",
    "num_bladia": "485",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 415,
    "name": "Meghila",
    "num_bladia": "465",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 416,
    "name": "Sebt",
    "num_bladia": "473",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 417,
    "name": "Sidi Hosni",
    "num_bladia": "479",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 418,
    "name": "Ain El Hadid",
    "num_bladia": "448",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 419,
    "name": "Frenda",
    "num_bladia": "456",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 420,
    "name": "Takhemaret",
    "num_bladia": "482",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 421,
    "name": "Ain Kermes",
    "num_bladia": "449",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 422,
    "name": "Djebilet Rosfa",
    "num_bladia": "453",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 423,
    "name": "Madna",
    "num_bladia": "460",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 424,
    "name": "Medrissa",
    "num_bladia": "463",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 425,
    "name": "Sidi Abderrahmane",
    "num_bladia": "476",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 426,
    "name": "Guertoufa",
    "num_bladia": "457",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 427,
    "name": "Serghine",
    "num_bladia": "474",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 428,
    "name": "Zmalet El Emir Abdelkade",
    "num_bladia": "486",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 429,
    "name": "Oued Lilli",
    "num_bladia": "469",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 430,
    "name": "Sidi Ali Mellal",
    "num_bladia": "477",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 431,
    "name": "Djillali Ben Amar",
    "num_bladia": "454",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 432,
    "name": "Mechraa Safa",
    "num_bladia": "462",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 433,
    "name": "Tagdempt",
    "num_bladia": "481",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 434,
    "name": "Bougara",
    "num_bladia": "450",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 435,
    "name": "Hamadia",
    "num_bladia": "458",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 436,
    "name": "Rechaiga",
    "num_bladia": "471",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 437,
    "name": "Tidda",
    "num_bladia": "484",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 438,
    "name": "Nadorah",
    "num_bladia": "467",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 439,
    "name": "Tiaret",
    "num_bladia": "483",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 440,
    "name": "Medroussa",
    "num_bladia": "464",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 441,
    "name": "Mellakou",
    "num_bladia": "466",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 442,
    "name": "Sidi Bakhti",
    "num_bladia": "478",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 443,
    "name": "Ain Deheb",
    "num_bladia": "446",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 444,
    "name": "Chehaima",
    "num_bladia": "451",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 445,
    "name": "Naima",
    "num_bladia": "468",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 446,
    "name": "Ain Bouchekif",
    "num_bladia": "445",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 447,
    "name": "Dahmouni",
    "num_bladia": "452",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 448,
    "name": "Rahouia",
    "num_bladia": "470",
    "wilaya": "Tiaret",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 449,
    "name": "Mizrana",
    "num_bladia": "535",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 450,
    "name": "Idjeur",
    "num_bladia": "522",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 451,
    "name": "Beni-Douala",
    "num_bladia": "510",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 452,
    "name": "Beni-Zikki",
    "num_bladia": "512",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 453,
    "name": "Illoula Oumalou",
    "num_bladia": "527",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 454,
    "name": "Agouni-Gueghrane",
    "num_bladia": "489",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 455,
    "name": "Ait Bouaddou",
    "num_bladia": "493",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 456,
    "name": "Ouadhias",
    "num_bladia": "538",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 457,
    "name": "Tizi N'tleta",
    "num_bladia": "547",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 458,
    "name": "Aghribs",
    "num_bladia": "488",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 459,
    "name": "Ait-Chafaa",
    "num_bladia": "498",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 460,
    "name": "Akerrou",
    "num_bladia": "504",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 461,
    "name": "Azeffoun",
    "num_bladia": "507",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 462,
    "name": "Iflissen",
    "num_bladia": "525",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 463,
    "name": "Tigzirt",
    "num_bladia": "544",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 464,
    "name": "Assi-Youcef",
    "num_bladia": "505",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 465,
    "name": "Boghni",
    "num_bladia": "513",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 466,
    "name": "Bounouh",
    "num_bladia": "515",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 467,
    "name": "Mechtras",
    "num_bladia": "533",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 468,
    "name": "Draa-Ben-Khedda",
    "num_bladia": "517",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 469,
    "name": "Sidi Namane",
    "num_bladia": "540",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 470,
    "name": "Tadmait",
    "num_bladia": "543",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 471,
    "name": "Tirmitine",
    "num_bladia": "546",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 472,
    "name": "Ait Boumahdi",
    "num_bladia": "494",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 473,
    "name": "Ait-Toudert",
    "num_bladia": "501",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 474,
    "name": "Beni-Aissi",
    "num_bladia": "509",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 475,
    "name": "Ouacif",
    "num_bladia": "537",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 476,
    "name": "Ait Khellili",
    "num_bladia": "495",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 477,
    "name": "Mekla",
    "num_bladia": "534",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 478,
    "name": "Souama",
    "num_bladia": "541",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 479,
    "name": "Beni-Yenni",
    "num_bladia": "511",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 480,
    "name": "Iboudrarene",
    "num_bladia": "521",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 481,
    "name": "Tizi-Ouzou",
    "num_bladia": "549",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 482,
    "name": "Abi-Youcef",
    "num_bladia": "487",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 483,
    "name": "Ain-El-Hammam",
    "num_bladia": "490",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 484,
    "name": "Ait-Yahia",
    "num_bladia": "502",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 485,
    "name": "Akbil",
    "num_bladia": "503",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 486,
    "name": "Boudjima",
    "num_bladia": "514",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 487,
    "name": "Makouda",
    "num_bladia": "532",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 488,
    "name": "Ain-Zaouia",
    "num_bladia": "491",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 489,
    "name": "Ait Yahia Moussa",
    "num_bladia": "496",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 490,
    "name": "Draa-El-Mizan",
    "num_bladia": "518",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 491,
    "name": "Frikat",
    "num_bladia": "520",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 492,
    "name": "M'kira",
    "num_bladia": "536",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 493,
    "name": "Tizi-Gheniff",
    "num_bladia": "548",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 494,
    "name": "Yatafene",
    "num_bladia": "552",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 495,
    "name": "Illilten",
    "num_bladia": "526",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 496,
    "name": "Imsouhal",
    "num_bladia": "528",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 497,
    "name": "Azazga",
    "num_bladia": "506",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 498,
    "name": "Freha",
    "num_bladia": "519",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 499,
    "name": "Ifigha",
    "num_bladia": "524",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 500,
    "name": "Yakourene",
    "num_bladia": "551",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 501,
    "name": "Zekri",
    "num_bladia": "553",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 502,
    "name": "Ait Aggouacha",
    "num_bladia": "492",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 503,
    "name": "Irdjen",
    "num_bladia": "529",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 504,
    "name": "Larbaa Nath Irathen",
    "num_bladia": "530",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 505,
    "name": "Ait-Oumalou",
    "num_bladia": "500",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 506,
    "name": "Tizi-Rached",
    "num_bladia": "550",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 507,
    "name": "Ait-Aissa-Mimoun",
    "num_bladia": "497",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 508,
    "name": "Ouaguenoun",
    "num_bladia": "539",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 509,
    "name": "Timizart",
    "num_bladia": "545",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 510,
    "name": "Maatkas",
    "num_bladia": "531",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 511,
    "name": "Souk-El-Tenine",
    "num_bladia": "542",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 512,
    "name": "Ait-Mahmoud",
    "num_bladia": "499",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 513,
    "name": "Beni Zmenzer",
    "num_bladia": "508",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 514,
    "name": "Iferhounene",
    "num_bladia": "523",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 515,
    "name": "Bouzeguene",
    "num_bladia": "516",
    "wilaya": "Tizi Ouzou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 516,
    "name": "Hussein Dey",
    "num_bladia": "588",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 517,
    "name": "Les Eucalyptus",
    "num_bladia": "592",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 518,
    "name": "Sidi Moussa",
    "num_bladia": "606",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 519,
    "name": "Kouba",
    "num_bladia": "591",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 520,
    "name": "Mohamed Belouzdad",
    "num_bladia": "594",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 521,
    "name": "Ain Taya",
    "num_bladia": "555",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 522,
    "name": "Bab Ezzouar",
    "num_bladia": "558",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 523,
    "name": "Bordj El Kiffan",
    "num_bladia": "569",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 524,
    "name": "Dar El Beida",
    "num_bladia": "574",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 525,
    "name": "El Marsa",
    "num_bladia": "584",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 526,
    "name": "Mohammadia",
    "num_bladia": "595",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 527,
    "name": "Bir Touta",
    "num_bladia": "566",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 528,
    "name": "Ouled Chebel",
    "num_bladia": "598",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 529,
    "name": "Tessala El Merdja",
    "num_bladia": "609",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 530,
    "name": "Herraoua",
    "num_bladia": "587",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 531,
    "name": "Reghaia",
    "num_bladia": "602",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 532,
    "name": "Rouiba",
    "num_bladia": "603",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 533,
    "name": "Maalma",
    "num_bladia": "593",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 534,
    "name": "Rahmania",
    "num_bladia": "600",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 535,
    "name": "Souidania",
    "num_bladia": "607",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 536,
    "name": "Staoueli",
    "num_bladia": "608",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 537,
    "name": "Zeralda",
    "num_bladia": "610",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 538,
    "name": "Baba Hassen",
    "num_bladia": "559",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 539,
    "name": "Douira",
    "num_bladia": "577",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 540,
    "name": "Draria",
    "num_bladia": "578",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 541,
    "name": "El Achour",
    "num_bladia": "579",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 542,
    "name": "Khraissia",
    "num_bladia": "590",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 543,
    "name": "Ain Benian",
    "num_bladia": "554",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 544,
    "name": "Cheraga",
    "num_bladia": "573",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 545,
    "name": "Dely Ibrahim",
    "num_bladia": "575",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 546,
    "name": "Hammamet",
    "num_bladia": "586",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 547,
    "name": "Ouled Fayet",
    "num_bladia": "599",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 548,
    "name": "Alger Centre",
    "num_bladia": "556",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 549,
    "name": "El Madania",
    "num_bladia": "582",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 550,
    "name": "El Mouradia",
    "num_bladia": "585",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 551,
    "name": "Sidi M'hamed",
    "num_bladia": "605",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 552,
    "name": "Sehaoula",
    "num_bladia": "604",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 553,
    "name": "Bologhine Ibnou Ziri",
    "num_bladia": "567",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 554,
    "name": "Casbah",
    "num_bladia": "572",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 555,
    "name": "Oued Koriche",
    "num_bladia": "596",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 556,
    "name": "Rais Hamidou",
    "num_bladia": "601",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 557,
    "name": "Bir Mourad Rais",
    "num_bladia": "564",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 558,
    "name": "Birkhadem",
    "num_bladia": "565",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 559,
    "name": "Djasr Kasentina",
    "num_bladia": "576",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 560,
    "name": "Hydra",
    "num_bladia": "589",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 561,
    "name": "El Magharia",
    "num_bladia": "583",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 562,
    "name": "Ben Aknoun",
    "num_bladia": "562",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 563,
    "name": "Beni Messous",
    "num_bladia": "563",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 564,
    "name": "Bouzareah",
    "num_bladia": "571",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 565,
    "name": "El Biar",
    "num_bladia": "580",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 566,
    "name": "Bachedjerah",
    "num_bladia": "560",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 567,
    "name": "Bourouba",
    "num_bladia": "570",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 568,
    "name": "El Harrach",
    "num_bladia": "581",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 569,
    "name": "Oued Smar",
    "num_bladia": "597",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 570,
    "name": "Baraki",
    "num_bladia": "561",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 571,
    "name": "Bordj El Bahri",
    "num_bladia": "568",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 572,
    "name": "Bab El Oued",
    "num_bladia": "557",
    "wilaya": "Alger",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 573,
    "name": "Hassi El Euch",
    "num_bladia": "634",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 574,
    "name": "Ain El Ibel",
    "num_bladia": "612",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 575,
    "name": "El Guedid",
    "num_bladia": "626",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 576,
    "name": "Charef",
    "num_bladia": "621",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 577,
    "name": "Benyagoub",
    "num_bladia": "618",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 578,
    "name": "Sidi Baizid",
    "num_bladia": "642",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 579,
    "name": "M'liliha",
    "num_bladia": "637",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 580,
    "name": "Dar Chioukh",
    "num_bladia": "622",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 581,
    "name": "Taadmit",
    "num_bladia": "644",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 582,
    "name": "Had Sahary",
    "num_bladia": "632",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 583,
    "name": "Bouira Lahdab",
    "num_bladia": "620",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 584,
    "name": "Ain Fekka",
    "num_bladia": "613",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 585,
    "name": "Sidi Laadjel",
    "num_bladia": "643",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 586,
    "name": "Hassi Fedoul",
    "num_bladia": "635",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 587,
    "name": "El Khemis",
    "num_bladia": "628",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 588,
    "name": "Selmana",
    "num_bladia": "641",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 589,
    "name": "Sed Rahal",
    "num_bladia": "640",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 590,
    "name": "Guettara",
    "num_bladia": "631",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 591,
    "name": "Deldoul",
    "num_bladia": "623",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 592,
    "name": "Zaccar",
    "num_bladia": "646",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 593,
    "name": "Douis",
    "num_bladia": "625",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 594,
    "name": "El Idrissia",
    "num_bladia": "627",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 595,
    "name": "Ain Chouhada",
    "num_bladia": "611",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 596,
    "name": "Djelfa",
    "num_bladia": "624",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 597,
    "name": "Birine",
    "num_bladia": "619",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 598,
    "name": "Oum Laadham",
    "num_bladia": "639",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 599,
    "name": "Faidh El Botma",
    "num_bladia": "629",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 600,
    "name": "Amourah",
    "num_bladia": "616",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 601,
    "name": "Zaafrane",
    "num_bladia": "645",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 602,
    "name": "Guernini",
    "num_bladia": "630",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 603,
    "name": "Benhar",
    "num_bladia": "617",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 604,
    "name": "Ain Maabed",
    "num_bladia": "614",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 605,
    "name": "Hassi Bahbah",
    "num_bladia": "633",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 606,
    "name": "Moudjebara",
    "num_bladia": "638",
    "wilaya": "Djelfa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 607,
    "name": "Jijel",
    "num_bladia": "662",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 608,
    "name": "El Aouana",
    "num_bladia": "656",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 609,
    "name": "Selma Benziada",
    "num_bladia": "668",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 610,
    "name": "Erraguene Souissi",
    "num_bladia": "660",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 611,
    "name": "Boussif Ouled Askeur",
    "num_bladia": "650",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 612,
    "name": "Ziama Mansouriah",
    "num_bladia": "674",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 613,
    "name": "Chahna",
    "num_bladia": "651",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 614,
    "name": "Emir Abdelkader",
    "num_bladia": "659",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 615,
    "name": "Oudjana",
    "num_bladia": "665",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 616,
    "name": "Taher",
    "num_bladia": "672",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 617,
    "name": "Chekfa",
    "num_bladia": "652",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 618,
    "name": "El Kennar Nouchfi",
    "num_bladia": "657",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 619,
    "name": "Sidi Abdelaziz",
    "num_bladia": "670",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 620,
    "name": "El Milia",
    "num_bladia": "658",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 621,
    "name": "Ouled Yahia Khadrouch",
    "num_bladia": "667",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 622,
    "name": "Ouled Rabah",
    "num_bladia": "666",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 623,
    "name": "Sidi Marouf",
    "num_bladia": "671",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 624,
    "name": "Ghebala",
    "num_bladia": "661",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 625,
    "name": "Settara",
    "num_bladia": "669",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 626,
    "name": "Bouraoui Belhadef",
    "num_bladia": "649",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 627,
    "name": "El Ancer",
    "num_bladia": "655",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 628,
    "name": "Khiri Oued Adjoul",
    "num_bladia": "664",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 629,
    "name": "Djimla",
    "num_bladia": "654",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 630,
    "name": "Kaous",
    "num_bladia": "663",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 631,
    "name": "Texenna",
    "num_bladia": "673",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 632,
    "name": "Bordj T'har",
    "num_bladia": "647",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 633,
    "name": "Boudria Beniyadjis",
    "num_bladia": "648",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 634,
    "name": "Djemaa Beni Habibi",
    "num_bladia": "653",
    "wilaya": "Jijel",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 635,
    "name": "Rosfa",
    "num_bladia": "726",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 636,
    "name": "Oued El Bared",
    "num_bladia": "721",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 637,
    "name": "Tizi N'bechar",
    "num_bladia": "734",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 638,
    "name": "Mezloug",
    "num_bladia": "720",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 639,
    "name": "Guellal",
    "num_bladia": "709",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 640,
    "name": "Kasr El Abtal",
    "num_bladia": "717",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 641,
    "name": "Ouled Si Ahmed",
    "num_bladia": "724",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 642,
    "name": "Ait Naoual Mezada",
    "num_bladia": "684",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 643,
    "name": "Ait-Tizi",
    "num_bladia": "685",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 644,
    "name": "Bouandas",
    "num_bladia": "699",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 645,
    "name": "Bousselam",
    "num_bladia": "701",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 646,
    "name": "Hamam Soukhna",
    "num_bladia": "713",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 647,
    "name": "Taya",
    "num_bladia": "732",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 648,
    "name": "Tella",
    "num_bladia": "733",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 649,
    "name": "Ain Oulmene",
    "num_bladia": "680",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 650,
    "name": "Boutaleb",
    "num_bladia": "702",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 651,
    "name": "Hamma",
    "num_bladia": "714",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 652,
    "name": "Ouled Tebben",
    "num_bladia": "725",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 653,
    "name": "Amoucha",
    "num_bladia": "686",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 654,
    "name": "Salah Bey",
    "num_bladia": "727",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 655,
    "name": "Ain Azel",
    "num_bladia": "677",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 656,
    "name": "Ain Lahdjar",
    "num_bladia": "679",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 657,
    "name": "Beidha Bordj",
    "num_bladia": "689",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 658,
    "name": "Bir Haddada",
    "num_bladia": "697",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 659,
    "name": "Guenzet",
    "num_bladia": "711",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 660,
    "name": "Harbil",
    "num_bladia": "716",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 661,
    "name": "Ain-Roua",
    "num_bladia": "682",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 662,
    "name": "Beni Oussine",
    "num_bladia": "694",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 663,
    "name": "El Ouricia",
    "num_bladia": "707",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 664,
    "name": "Bougaa",
    "num_bladia": "700",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 665,
    "name": "Draa-Kebila",
    "num_bladia": "705",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 666,
    "name": "Hammam Guergour",
    "num_bladia": "715",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 667,
    "name": "Setif",
    "num_bladia": "729",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 668,
    "name": "Ain El Kebira",
    "num_bladia": "678",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 669,
    "name": "Dehamcha",
    "num_bladia": "703",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 670,
    "name": "Ouled Addouane",
    "num_bladia": "722",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 671,
    "name": "Ain-Sebt",
    "num_bladia": "683",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 672,
    "name": "Beni-Aziz",
    "num_bladia": "695",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 673,
    "name": "Maaouia",
    "num_bladia": "718",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 674,
    "name": "Bellaa",
    "num_bladia": "690",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 675,
    "name": "Bir-El-Arch",
    "num_bladia": "698",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 676,
    "name": "El-Ouldja",
    "num_bladia": "708",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 677,
    "name": "Tachouda",
    "num_bladia": "730",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 678,
    "name": "Tala-Ifacene",
    "num_bladia": "731",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 679,
    "name": "Serdj-El-Ghoul",
    "num_bladia": "728",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 680,
    "name": "Guidjel",
    "num_bladia": "712",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 681,
    "name": "Ouled Sabor",
    "num_bladia": "723",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 682,
    "name": "Bazer-Sakra",
    "num_bladia": "688",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 683,
    "name": "El Eulma",
    "num_bladia": "706",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 684,
    "name": "Guelta Zerka",
    "num_bladia": "710",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 685,
    "name": "Beni Fouda",
    "num_bladia": "692",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 686,
    "name": "Djemila",
    "num_bladia": "704",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 687,
    "name": "Ain-Legradj",
    "num_bladia": "681",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 688,
    "name": "Beni Chebana",
    "num_bladia": "691",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 689,
    "name": "Beni Ourtilane",
    "num_bladia": "693",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 690,
    "name": "Beni-Mouhli",
    "num_bladia": "696",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 691,
    "name": "Ain Abessa",
    "num_bladia": "675",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 692,
    "name": "Ain Arnat",
    "num_bladia": "676",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 693,
    "name": "Babor",
    "num_bladia": "687",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 694,
    "name": "Maouaklane",
    "num_bladia": "719",
    "wilaya": "Sétif",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 695,
    "name": "Saida",
    "num_bladia": "745",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 696,
    "name": "Tircine",
    "num_bladia": "749",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 697,
    "name": "Ouled Brahim",
    "num_bladia": "743",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 698,
    "name": "Ain Soltane",
    "num_bladia": "737",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 699,
    "name": "Maamora",
    "num_bladia": "741",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 700,
    "name": "El Hassasna",
    "num_bladia": "739",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 701,
    "name": "Ain Sekhouna",
    "num_bladia": "736",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 702,
    "name": "Sidi Boubekeur",
    "num_bladia": "748",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 703,
    "name": "Ouled Khaled",
    "num_bladia": "744",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 704,
    "name": "Hounet",
    "num_bladia": "740",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 705,
    "name": "Youb",
    "num_bladia": "750",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 706,
    "name": "Doui Thabet",
    "num_bladia": "738",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 707,
    "name": "Sidi Ahmed",
    "num_bladia": "746",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 708,
    "name": "Moulay Larbi",
    "num_bladia": "742",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 709,
    "name": "Ain El Hadjar",
    "num_bladia": "735",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 710,
    "name": "Sidi Amar",
    "num_bladia": "747",
    "wilaya": "Saïda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 711,
    "name": "Ain Bouziane",
    "num_bladia": "751",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 712,
    "name": "Salah Bouchaour",
    "num_bladia": "783",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 713,
    "name": "El Hadaiek",
    "num_bladia": "768",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 714,
    "name": "Zerdezas",
    "num_bladia": "787",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 715,
    "name": "Ouled Habbaba",
    "num_bladia": "780",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 716,
    "name": "Beni Oulbane",
    "num_bladia": "759",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 717,
    "name": "Sidi Mezghiche",
    "num_bladia": "784",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 718,
    "name": "Beni Bechir",
    "num_bladia": "758",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 719,
    "name": "Ramdane Djamel",
    "num_bladia": "782",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 720,
    "name": "Bin El Ouiden",
    "num_bladia": "761",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 721,
    "name": "Emjez Edchich",
    "num_bladia": "770",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 722,
    "name": "Tamalous",
    "num_bladia": "786",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 723,
    "name": "Ain Kechra",
    "num_bladia": "753",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 724,
    "name": "Ouldja Boulbalout",
    "num_bladia": "778",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 725,
    "name": "Oum Toub",
    "num_bladia": "781",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 726,
    "name": "El Ghedir",
    "num_bladia": "767",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 727,
    "name": "Kerkara",
    "num_bladia": "775",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 728,
    "name": "El Arrouch",
    "num_bladia": "766",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 729,
    "name": "Zitouna",
    "num_bladia": "788",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 730,
    "name": "Ouled Attia",
    "num_bladia": "779",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 731,
    "name": "Oued Zhour",
    "num_bladia": "777",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 732,
    "name": "Collo",
    "num_bladia": "764",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 733,
    "name": "Cheraia",
    "num_bladia": "763",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 734,
    "name": "Beni Zid",
    "num_bladia": "760",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 735,
    "name": "Khenag Maoune",
    "num_bladia": "776",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 736,
    "name": "El Marsa",
    "num_bladia": "769",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 737,
    "name": "Ben Azzouz",
    "num_bladia": "757",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 738,
    "name": "Bekkouche Lakhdar",
    "num_bladia": "756",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 739,
    "name": "Es Sebt",
    "num_bladia": "771",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 740,
    "name": "Ain Charchar",
    "num_bladia": "752",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 741,
    "name": "Azzaba",
    "num_bladia": "755",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 742,
    "name": "Bouchetata",
    "num_bladia": "762",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 743,
    "name": "Filfila",
    "num_bladia": "772",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 744,
    "name": "Hammadi Krouma",
    "num_bladia": "773",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 745,
    "name": "Skikda",
    "num_bladia": "785",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 746,
    "name": "Ain Zouit",
    "num_bladia": "754",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 747,
    "name": "Djendel Saadi Mohamed",
    "num_bladia": "765",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 748,
    "name": "Kanoua",
    "num_bladia": "774",
    "wilaya": "Skikda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 749,
    "name": "Sidi Ali Benyoub",
    "num_bladia": "822",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 750,
    "name": "Moulay Slissen",
    "num_bladia": "814",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 751,
    "name": "El Hacaiba",
    "num_bladia": "804",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 752,
    "name": "Ain Tindamine",
    "num_bladia": "792",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 753,
    "name": "Tenira",
    "num_bladia": "837",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 754,
    "name": "Oued Sefioun",
    "num_bladia": "816",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 755,
    "name": "Hassi Dahou",
    "num_bladia": "805",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 756,
    "name": "Oued Taourira",
    "num_bladia": "817",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 757,
    "name": "Benachiba Chelia",
    "num_bladia": "798",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 758,
    "name": "Sidi Yacoub",
    "num_bladia": "831",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 759,
    "name": "Sidi Lahcene",
    "num_bladia": "830",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 760,
    "name": "Sidi Khaled",
    "num_bladia": "829",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 761,
    "name": "Tabia",
    "num_bladia": "832",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 762,
    "name": "Sidi Brahim",
    "num_bladia": "825",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 763,
    "name": "Amarnas",
    "num_bladia": "794",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 764,
    "name": "Boukhanefis",
    "num_bladia": "801",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 765,
    "name": "Hassi Zahana",
    "num_bladia": "806",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 766,
    "name": "Chetouane Belaila",
    "num_bladia": "802",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 767,
    "name": "Ben Badis",
    "num_bladia": "797",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 768,
    "name": "Bedrabine El Mokrani",
    "num_bladia": "795",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 769,
    "name": "Sfisef",
    "num_bladia": "821",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 770,
    "name": "M'cid",
    "num_bladia": "810",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 771,
    "name": "Boudjebaa El Bordj",
    "num_bladia": "800",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 772,
    "name": "Ain- Adden",
    "num_bladia": "793",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 773,
    "name": "Sidi Hamadouche",
    "num_bladia": "828",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 774,
    "name": "Sidi Chaib",
    "num_bladia": "826",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 775,
    "name": "Makedra",
    "num_bladia": "808",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 776,
    "name": "Ain El Berd",
    "num_bladia": "789",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 777,
    "name": "Redjem Demouche",
    "num_bladia": "819",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 778,
    "name": "Ras El Ma",
    "num_bladia": "818",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 779,
    "name": "Oued Sebaa",
    "num_bladia": "815",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 780,
    "name": "Marhoum",
    "num_bladia": "809",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 781,
    "name": "Sidi Bel-Abbes",
    "num_bladia": "824",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 782,
    "name": "Ain Thrid",
    "num_bladia": "791",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 783,
    "name": "Sehala Thaoura",
    "num_bladia": "820",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 784,
    "name": "Tessala",
    "num_bladia": "838",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 785,
    "name": "Belarbi",
    "num_bladia": "796",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 786,
    "name": "Mostefa  Ben Brahim",
    "num_bladia": "813",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 787,
    "name": "Tilmouni",
    "num_bladia": "839",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 788,
    "name": "Zerouala",
    "num_bladia": "840",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 789,
    "name": "Dhaya",
    "num_bladia": "803",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 790,
    "name": "Mezaourou",
    "num_bladia": "812",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 791,
    "name": "Teghalimet",
    "num_bladia": "835",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 792,
    "name": "Telagh",
    "num_bladia": "836",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 793,
    "name": "Ain Kada",
    "num_bladia": "790",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 794,
    "name": "Lamtar",
    "num_bladia": "807",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 795,
    "name": "Sidi Ali Boussidi",
    "num_bladia": "823",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 796,
    "name": "Sidi Dahou Zairs",
    "num_bladia": "827",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 797,
    "name": "Bir El Hammam",
    "num_bladia": "799",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 798,
    "name": "Merine",
    "num_bladia": "811",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 799,
    "name": "Tefessour",
    "num_bladia": "834",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 800,
    "name": "Taoudmout",
    "num_bladia": "833",
    "wilaya": "Sidi Bel Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 801,
    "name": "Annaba",
    "num_bladia": "842",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 802,
    "name": "Seraidi",
    "num_bladia": "850",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 803,
    "name": "Berrahal",
    "num_bladia": "843",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 804,
    "name": "Oued El Aneb",
    "num_bladia": "849",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 805,
    "name": "El Hadjar",
    "num_bladia": "848",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 806,
    "name": "Sidi Amar",
    "num_bladia": "851",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 807,
    "name": "El Bouni",
    "num_bladia": "846",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 808,
    "name": "Ain El Berda",
    "num_bladia": "841",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 809,
    "name": "Cheurfa",
    "num_bladia": "845",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 810,
    "name": "El Eulma",
    "num_bladia": "847",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 811,
    "name": "Treat",
    "num_bladia": "852",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 812,
    "name": "Chetaibi",
    "num_bladia": "844",
    "wilaya": "Annaba",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 813,
    "name": "Nechmaya",
    "num_bladia": "875",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 814,
    "name": "Bou Hamdane",
    "num_bladia": "863",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 815,
    "name": "Hammam Debagh",
    "num_bladia": "872",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 816,
    "name": "Roknia",
    "num_bladia": "884",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 817,
    "name": "Dahouara",
    "num_bladia": "867",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 818,
    "name": "Hammam N'bail",
    "num_bladia": "873",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 819,
    "name": "Guelma",
    "num_bladia": "871",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 820,
    "name": "Boumahra Ahmed",
    "num_bladia": "866",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 821,
    "name": "Ain Ben Beida",
    "num_bladia": "853",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 822,
    "name": "Bouchegouf",
    "num_bladia": "865",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 823,
    "name": "Medjez Sfa",
    "num_bladia": "878",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 824,
    "name": "Oued Ferragha",
    "num_bladia": "881",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 825,
    "name": "Bouati Mahmoud",
    "num_bladia": "864",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 826,
    "name": "El Fedjoudj",
    "num_bladia": "869",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 827,
    "name": "Heliopolis",
    "num_bladia": "874",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 828,
    "name": "Medjez Amar",
    "num_bladia": "877",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 829,
    "name": "Houari Boumedienne",
    "num_bladia": "879",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 830,
    "name": "Ras El Agba",
    "num_bladia": "883",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 831,
    "name": "Sellaoua Announa",
    "num_bladia": "885",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 832,
    "name": "Djeballah Khemissi",
    "num_bladia": "868",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 833,
    "name": "Bordj Sabath",
    "num_bladia": "861",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 834,
    "name": "Oued Zenati",
    "num_bladia": "882",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 835,
    "name": "Ain Regada",
    "num_bladia": "856",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 836,
    "name": "Ain Larbi",
    "num_bladia": "854",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 837,
    "name": "Ain Makhlouf",
    "num_bladia": "855",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 838,
    "name": "Tamlouka",
    "num_bladia": "886",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 839,
    "name": "Ain Sandel",
    "num_bladia": "857",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 840,
    "name": "Bou Hachana",
    "num_bladia": "862",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 841,
    "name": "Khezaras",
    "num_bladia": "876",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 842,
    "name": "Belkheir",
    "num_bladia": "858",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 843,
    "name": "Beni Mezline",
    "num_bladia": "860",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 844,
    "name": "Guelaat Bou Sbaa",
    "num_bladia": "870",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 845,
    "name": "Oued Cheham",
    "num_bladia": "880",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 846,
    "name": "Bendjarah",
    "num_bladia": "859",
    "wilaya": "Guelma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 847,
    "name": "Didouche Mourad",
    "num_bladia": "892",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 848,
    "name": "Hamma Bouziane",
    "num_bladia": "894",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 849,
    "name": "Beni Hamidane",
    "num_bladia": "890",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 850,
    "name": "Zighoud Youcef",
    "num_bladia": "898",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 851,
    "name": "Ain Smara",
    "num_bladia": "888",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 852,
    "name": "El Khroub",
    "num_bladia": "893",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 853,
    "name": "Ouled Rahmoun",
    "num_bladia": "897",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 854,
    "name": "Ain Abid",
    "num_bladia": "887",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 855,
    "name": "Ben Badis",
    "num_bladia": "889",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 856,
    "name": "Ibn Ziad",
    "num_bladia": "895",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 857,
    "name": "Messaoud Boudjeriou",
    "num_bladia": "896",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 858,
    "name": "Constantine",
    "num_bladia": "891",
    "wilaya": "Constantine",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 859,
    "name": "Ouled Hellal",
    "num_bladia": "943",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 860,
    "name": "Souagui",
    "num_bladia": "956",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 861,
    "name": "M'fatha",
    "num_bladia": "934",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 862,
    "name": "Saneg",
    "num_bladia": "947",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 863,
    "name": "El Azizia",
    "num_bladia": "920",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 864,
    "name": "Maghraoua",
    "num_bladia": "930",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 865,
    "name": "Mihoub",
    "num_bladia": "935",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 866,
    "name": "Bouaiche",
    "num_bladia": "909",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 867,
    "name": "Boughzoul",
    "num_bladia": "912",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 868,
    "name": "Chabounia",
    "num_bladia": "914",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 869,
    "name": "Hannacha",
    "num_bladia": "926",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 870,
    "name": "Ouamri",
    "num_bladia": "936",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 871,
    "name": "Oued Harbil",
    "num_bladia": "937",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 872,
    "name": "Beni Slimane",
    "num_bladia": "905",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 873,
    "name": "Bouaichoune",
    "num_bladia": "910",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 874,
    "name": "Ouled Bouachra",
    "num_bladia": "939",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 875,
    "name": "Si Mahdjoub",
    "num_bladia": "950",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 876,
    "name": "Bouskene",
    "num_bladia": "913",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 877,
    "name": "Sidi Rabie",
    "num_bladia": "953",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 878,
    "name": "Berrouaghia",
    "num_bladia": "906",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 879,
    "name": "Ouled Deid",
    "num_bladia": "941",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 880,
    "name": "Rebaia",
    "num_bladia": "946",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 881,
    "name": "Medjebar",
    "num_bladia": "932",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 882,
    "name": "Tletat Ed Douair",
    "num_bladia": "961",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 883,
    "name": "Zoubiria",
    "num_bladia": "962",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 884,
    "name": "Aissaouia",
    "num_bladia": "901",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 885,
    "name": "El Haoudane",
    "num_bladia": "923",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 886,
    "name": "Mezerana",
    "num_bladia": "933",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 887,
    "name": "Tablat",
    "num_bladia": "957",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 888,
    "name": "Boghar",
    "num_bladia": "908",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 889,
    "name": "Seghouane",
    "num_bladia": "949",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 890,
    "name": "Draa Esmar",
    "num_bladia": "919",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 891,
    "name": "Medea",
    "num_bladia": "931",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 892,
    "name": "Tamesguida",
    "num_bladia": "959",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 893,
    "name": "Ben Chicao",
    "num_bladia": "904",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 894,
    "name": "El Hamdania",
    "num_bladia": "922",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 895,
    "name": "Ouzera",
    "num_bladia": "945",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 896,
    "name": "Tizi Mahdi",
    "num_bladia": "960",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 897,
    "name": "Ain Boucif",
    "num_bladia": "899",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 898,
    "name": "El Ouinet",
    "num_bladia": "925",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 899,
    "name": "Kef Lakhdar",
    "num_bladia": "927",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 900,
    "name": "Ouled Emaaraf",
    "num_bladia": "942",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 901,
    "name": "Sidi Demed",
    "num_bladia": "951",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 902,
    "name": "Baata",
    "num_bladia": "903",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 903,
    "name": "El Omaria",
    "num_bladia": "924",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 904,
    "name": "Ouled Brahim",
    "num_bladia": "940",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 905,
    "name": "Bir Ben Laabed",
    "num_bladia": "907",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 906,
    "name": "El Guelbelkebir",
    "num_bladia": "921",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 907,
    "name": "Sedraya",
    "num_bladia": "948",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 908,
    "name": "Ain Ouksir",
    "num_bladia": "900",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 909,
    "name": "Chelalet El Adhaoura",
    "num_bladia": "915",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 910,
    "name": "Cheniguel",
    "num_bladia": "916",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 911,
    "name": "Tafraout",
    "num_bladia": "958",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 912,
    "name": "Bouchrahil",
    "num_bladia": "911",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 913,
    "name": "Khams Djouamaa",
    "num_bladia": "928",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 914,
    "name": "Sidi Naamane",
    "num_bladia": "952",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 915,
    "name": "Aziz",
    "num_bladia": "902",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 916,
    "name": "Derrag",
    "num_bladia": "917",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 917,
    "name": "Oum El Djellil",
    "num_bladia": "944",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 918,
    "name": "Djouab",
    "num_bladia": "918",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 919,
    "name": "Sidi Zahar",
    "num_bladia": "954",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 920,
    "name": "Sidi Ziane",
    "num_bladia": "955",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 921,
    "name": "Ouled Antar",
    "num_bladia": "938",
    "wilaya": "Médéa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 922,
    "name": "Fornaka",
    "num_bladia": "970",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 923,
    "name": "Oued El Kheir",
    "num_bladia": "981",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 924,
    "name": "Hassiane",
    "num_bladia": "973",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 925,
    "name": "Hassi Mameche",
    "num_bladia": "972",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 926,
    "name": "Mazagran",
    "num_bladia": "977",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 927,
    "name": "Stidia",
    "num_bladia": "992",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 928,
    "name": "Ain-Tedles",
    "num_bladia": "967",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 929,
    "name": "Sidi Belaattar",
    "num_bladia": "987",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 930,
    "name": "Sour",
    "num_bladia": "991",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 931,
    "name": "Ain-Boudinar",
    "num_bladia": "964",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 932,
    "name": "Kheir-Eddine",
    "num_bladia": "975",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 933,
    "name": "Sayada",
    "num_bladia": "985",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 934,
    "name": "Sidi Ali",
    "num_bladia": "986",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 935,
    "name": "Tazgait",
    "num_bladia": "993",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 936,
    "name": "Benabdelmalek Ramdane",
    "num_bladia": "968",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 937,
    "name": "Mostaganem",
    "num_bladia": "979",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 938,
    "name": "Hadjadj",
    "num_bladia": "971",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 939,
    "name": "Sidi-Lakhdar",
    "num_bladia": "988",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 940,
    "name": "Achaacha",
    "num_bladia": "963",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 941,
    "name": "Khadra",
    "num_bladia": "974",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 942,
    "name": "Nekmaria",
    "num_bladia": "980",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 943,
    "name": "Ouled Boughalem",
    "num_bladia": "982",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 944,
    "name": "Bouguirat",
    "num_bladia": "969",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 945,
    "name": "Safsaf",
    "num_bladia": "984",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 946,
    "name": "Sirat",
    "num_bladia": "989",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 947,
    "name": "Souaflia",
    "num_bladia": "990",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 948,
    "name": "Ain-Sidi Cherif",
    "num_bladia": "966",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 949,
    "name": "Mansourah",
    "num_bladia": "976",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 950,
    "name": "Mesra",
    "num_bladia": "978",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 951,
    "name": "Touahria",
    "num_bladia": "994",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 952,
    "name": "Ain-Nouissy",
    "num_bladia": "965",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 953,
    "name": "Ouled-Maalah",
    "num_bladia": "983",
    "wilaya": "Mostaganem",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 954,
    "name": "Chellal",
    "num_bladia": "1008",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 955,
    "name": "Ouled Madhi",
    "num_bladia": "1028",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 956,
    "name": "Khettouti Sed-El-Jir",
    "num_bladia": "1014",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 957,
    "name": "Belaiba",
    "num_bladia": "1000",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 958,
    "name": "Berhoum",
    "num_bladia": "1004",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 959,
    "name": "Dehahna",
    "num_bladia": "1009",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 960,
    "name": "Magra",
    "num_bladia": "1018",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 961,
    "name": "Beni Ilmane",
    "num_bladia": "1002",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 962,
    "name": "Bouti Sayeh",
    "num_bladia": "1007",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 963,
    "name": "Sidi Aissa",
    "num_bladia": "1033",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 964,
    "name": "Ain El Hadjel",
    "num_bladia": "995",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 965,
    "name": "Sidi Hadjeres",
    "num_bladia": "1035",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 966,
    "name": "El Hamel",
    "num_bladia": "1011",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 967,
    "name": "Oulteme",
    "num_bladia": "1032",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 968,
    "name": "Benzouh",
    "num_bladia": "1003",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 969,
    "name": "Ouled Sidi Brahim",
    "num_bladia": "1030",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 970,
    "name": "Sidi Ameur",
    "num_bladia": "1034",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 971,
    "name": "Tamsa",
    "num_bladia": "1039",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 972,
    "name": "Ben Srour",
    "num_bladia": "1001",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 973,
    "name": "Mohamed Boudiaf",
    "num_bladia": "1022",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 974,
    "name": "Ouled Slimane",
    "num_bladia": "1031",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 975,
    "name": "Zarzour",
    "num_bladia": "1041",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 976,
    "name": "Ain El Melh",
    "num_bladia": "996",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 977,
    "name": "Ain Fares",
    "num_bladia": "997",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 978,
    "name": "Ain Rich",
    "num_bladia": "999",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 979,
    "name": "Bir Foda",
    "num_bladia": "1005",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 980,
    "name": "Sidi M'hamed",
    "num_bladia": "1036",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 981,
    "name": "Medjedel",
    "num_bladia": "1020",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 982,
    "name": "Menaa",
    "num_bladia": "1021",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 983,
    "name": "Djebel Messaad",
    "num_bladia": "1010",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 984,
    "name": "Slim",
    "num_bladia": "1037",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 985,
    "name": "M'sila",
    "num_bladia": "1023",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 986,
    "name": "Hammam Dalaa",
    "num_bladia": "1013",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 987,
    "name": "Ouanougha",
    "num_bladia": "1025",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 988,
    "name": "Ouled Mansour",
    "num_bladia": "1029",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 989,
    "name": "Tarmount",
    "num_bladia": "1040",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 990,
    "name": "Maadid",
    "num_bladia": "1016",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 991,
    "name": "M'tarfa",
    "num_bladia": "1024",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 992,
    "name": "Maarif",
    "num_bladia": "1017",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 993,
    "name": "Ouled Derradj",
    "num_bladia": "1027",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 994,
    "name": "Souamaa",
    "num_bladia": "1038",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 995,
    "name": "El Houamed",
    "num_bladia": "1012",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 996,
    "name": "Khoubana",
    "num_bladia": "1015",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 997,
    "name": "M'cif",
    "num_bladia": "1019",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 998,
    "name": "Ain Khadra",
    "num_bladia": "998",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 999,
    "name": "Ouled Addi Guebala",
    "num_bladia": "1026",
    "wilaya": "M'Sila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1000,
    "name": "Oued El Abtal",
    "num_bladia": "1075",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1001,
    "name": "Sidi Abdelmoumene",
    "num_bladia": "1081",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1002,
    "name": "Sedjerara",
    "num_bladia": "1078",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1003,
    "name": "Mohammadia",
    "num_bladia": "1072",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1004,
    "name": "Tighennif",
    "num_bladia": "1085",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1005,
    "name": "Mocta-Douz",
    "num_bladia": "1071",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1006,
    "name": "Ferraguig",
    "num_bladia": "1060",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1007,
    "name": "El Ghomri",
    "num_bladia": "1054",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1008,
    "name": "Zahana",
    "num_bladia": "1087",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1009,
    "name": "El Gaada",
    "num_bladia": "1053",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1010,
    "name": "Ras El Ain Amirouche",
    "num_bladia": "1077",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1011,
    "name": "Oggaz",
    "num_bladia": "1074",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1012,
    "name": "Alaimia",
    "num_bladia": "1046",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1013,
    "name": "Sig",
    "num_bladia": "1084",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1014,
    "name": "Chorfa",
    "num_bladia": "1051",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1015,
    "name": "Bou Henni",
    "num_bladia": "1049",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1016,
    "name": "El Mamounia",
    "num_bladia": "1058",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1017,
    "name": "El Gueitena",
    "num_bladia": "1055",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1018,
    "name": "Ain Fares",
    "num_bladia": "1042",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1019,
    "name": "Gharrous",
    "num_bladia": "1062",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1020,
    "name": "Benian",
    "num_bladia": "1048",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1021,
    "name": "Aouf",
    "num_bladia": "1047",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1022,
    "name": "Guerdjoum",
    "num_bladia": "1064",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1023,
    "name": "Ain Frass",
    "num_bladia": "1045",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1024,
    "name": "Ain Fekan",
    "num_bladia": "1043",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1025,
    "name": "Khalouia",
    "num_bladia": "1066",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1026,
    "name": "El Menaouer",
    "num_bladia": "1059",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1027,
    "name": "El Bordj",
    "num_bladia": "1052",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1028,
    "name": "Sidi Boussaid",
    "num_bladia": "1082",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1029,
    "name": "Matemore",
    "num_bladia": "1070",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1030,
    "name": "Sidi Kada",
    "num_bladia": "1083",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1031,
    "name": "Makhda",
    "num_bladia": "1067",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1032,
    "name": "Mascara",
    "num_bladia": "1069",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1033,
    "name": "Bouhanifia",
    "num_bladia": "1050",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1034,
    "name": "Ghriss",
    "num_bladia": "1063",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1035,
    "name": "Hacine",
    "num_bladia": "1065",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1036,
    "name": "El Keurt",
    "num_bladia": "1057",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1037,
    "name": "Froha",
    "num_bladia": "1061",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1038,
    "name": "Tizi",
    "num_bladia": "1086",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1039,
    "name": "Sehailia",
    "num_bladia": "1079",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1040,
    "name": "Maoussa",
    "num_bladia": "1068",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1041,
    "name": "Sidi Abdeldjebar",
    "num_bladia": "1080",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1042,
    "name": "El Hachem",
    "num_bladia": "1056",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1043,
    "name": "Nesmot",
    "num_bladia": "1073",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1044,
    "name": "Zelamta",
    "num_bladia": "1088",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1045,
    "name": "Ain Ferah",
    "num_bladia": "1044",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1046,
    "name": "Oued Taria",
    "num_bladia": "1076",
    "wilaya": "Mascara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1047,
    "name": "Ouargla",
    "num_bladia": "1101",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1048,
    "name": "Hassi Messaoud",
    "num_bladia": "1096",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1049,
    "name": "Ain Beida",
    "num_bladia": "1089",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1050,
    "name": "Hassi Ben Abdellah",
    "num_bladia": "1095",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1051,
    "name": "Sidi Khouiled",
    "num_bladia": "1103",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1052,
    "name": "El Borma",
    "num_bladia": "1093",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1053,
    "name": "Rouissat",
    "num_bladia": "1102",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1054,
    "name": "N'goussa",
    "num_bladia": "1100",
    "wilaya": "Ouargla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1055,
    "name": "Sidi Chami",
    "num_bladia": "1134",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1056,
    "name": "Hassi Mefsoukh",
    "num_bladia": "1127",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1057,
    "name": "Bir El Djir",
    "num_bladia": "1116",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1058,
    "name": "Hassi Ben Okba",
    "num_bladia": "1125",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1059,
    "name": "Gdyel",
    "num_bladia": "1124",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1060,
    "name": "Hassi Bounif",
    "num_bladia": "1126",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1061,
    "name": "El Kerma",
    "num_bladia": "1122",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1062,
    "name": "Es Senia",
    "num_bladia": "1123",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1063,
    "name": "Ben Freha",
    "num_bladia": "1114",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1064,
    "name": "Arzew",
    "num_bladia": "1113",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1065,
    "name": "Sidi Ben Yebka",
    "num_bladia": "1133",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1066,
    "name": "Ain Biya",
    "num_bladia": "1110",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1067,
    "name": "Bethioua",
    "num_bladia": "1115",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1068,
    "name": "Marsat El Hadjadj",
    "num_bladia": "1128",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1069,
    "name": "Ain Turk",
    "num_bladia": "1112",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1070,
    "name": "Oran",
    "num_bladia": "1131",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1071,
    "name": "El Ancor",
    "num_bladia": "1120",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1072,
    "name": "Mers El Kebir",
    "num_bladia": "1129",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1073,
    "name": "Boufatis",
    "num_bladia": "1117",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1074,
    "name": "El Braya",
    "num_bladia": "1121",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1075,
    "name": "Oued Tlelat",
    "num_bladia": "1132",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1076,
    "name": "Ain Kerma",
    "num_bladia": "1111",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1077,
    "name": "Boutlelis",
    "num_bladia": "1119",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1078,
    "name": "Messerghin",
    "num_bladia": "1130",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1079,
    "name": "Bousfer",
    "num_bladia": "1118",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1080,
    "name": "Tafraoui",
    "num_bladia": "1135",
    "wilaya": "Oran",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1081,
    "name": "Ain El Orak",
    "num_bladia": "1136",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1082,
    "name": "Krakda",
    "num_bladia": "1151",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1083,
    "name": "Sidi Slimane",
    "num_bladia": "1154",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1084,
    "name": "Sidi Ameur",
    "num_bladia": "1153",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1085,
    "name": "Boualem",
    "num_bladia": "1138",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1086,
    "name": "El Bnoud",
    "num_bladia": "1146",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1087,
    "name": "Bougtoub",
    "num_bladia": "1139",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1088,
    "name": "El Kheiter",
    "num_bladia": "1147",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1089,
    "name": "Tousmouline",
    "num_bladia": "1157",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1090,
    "name": "Sidi Tiffour",
    "num_bladia": "1155",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1091,
    "name": "Stitten",
    "num_bladia": "1156",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1092,
    "name": "El Bayadh",
    "num_bladia": "1144",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1093,
    "name": "Rogassa",
    "num_bladia": "1152",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1094,
    "name": "El Mehara",
    "num_bladia": "1148",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1095,
    "name": "Kef El Ahmar",
    "num_bladia": "1150",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1096,
    "name": "Brezina",
    "num_bladia": "1141",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1097,
    "name": "Ghassoul",
    "num_bladia": "1149",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1098,
    "name": "Boussemghoun",
    "num_bladia": "1140",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1099,
    "name": "Cheguig",
    "num_bladia": "1142",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1100,
    "name": "Chellala",
    "num_bladia": "1143",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1101,
    "name": "Arbaouat",
    "num_bladia": "1137",
    "wilaya": "El Bayadh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1102,
    "name": "Bordj Omar Driss",
    "num_bladia": "1159",
    "wilaya": "Illizi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1103,
    "name": "Debdeb",
    "num_bladia": "1160",
    "wilaya": "Illizi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1104,
    "name": "In Amenas",
    "num_bladia": "1163",
    "wilaya": "Illizi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1105,
    "name": "Illizi",
    "num_bladia": "1162",
    "wilaya": "Illizi",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1106,
    "name": "Elhammadia",
    "num_bladia": "1177",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1107,
    "name": "Ouled Sidi-Brahim",
    "num_bladia": "1189",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1108,
    "name": "Ain Taghrout",
    "num_bladia": "1164",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1109,
    "name": "Tixter",
    "num_bladia": "1197",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1110,
    "name": "Belimour",
    "num_bladia": "1167",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1111,
    "name": "El Annasseur",
    "num_bladia": "1176",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1112,
    "name": "Ghailasa",
    "num_bladia": "1180",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1113,
    "name": "Taglait",
    "num_bladia": "1194",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1114,
    "name": "Bordj Ghedir",
    "num_bladia": "1170",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1115,
    "name": "El Euch",
    "num_bladia": "1174",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1116,
    "name": "Sidi-Embarek",
    "num_bladia": "1192",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1117,
    "name": "Khelil",
    "num_bladia": "1183",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1118,
    "name": "Bir Kasdali",
    "num_bladia": "1169",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1119,
    "name": "Tefreg",
    "num_bladia": "1193",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1120,
    "name": "El Main",
    "num_bladia": "1178",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1121,
    "name": "Djaafra",
    "num_bladia": "1173",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1122,
    "name": "Colla",
    "num_bladia": "1172",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1123,
    "name": "Teniet En Nasr",
    "num_bladia": "1196",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1124,
    "name": "El M'hir",
    "num_bladia": "1179",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1125,
    "name": "Ksour",
    "num_bladia": "1184",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1126,
    "name": "Mansoura",
    "num_bladia": "1185",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1127,
    "name": "Haraza",
    "num_bladia": "1181",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1128,
    "name": "Rabta",
    "num_bladia": "1190",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1129,
    "name": "El Achir",
    "num_bladia": "1175",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1130,
    "name": "Hasnaoua",
    "num_bladia": "1182",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1131,
    "name": "Medjana",
    "num_bladia": "1186",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1132,
    "name": "Ain Tesra",
    "num_bladia": "1165",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1133,
    "name": "Ouled Brahem",
    "num_bladia": "1187",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1134,
    "name": "Ras El Oued",
    "num_bladia": "1191",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1135,
    "name": "Bordj Zemmoura",
    "num_bladia": "1171",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1136,
    "name": "Ouled Dahmane",
    "num_bladia": "1188",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1137,
    "name": "Tassamert",
    "num_bladia": "1195",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1138,
    "name": "B. B. Arreridj",
    "num_bladia": "1166",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1139,
    "name": "Ben Daoud",
    "num_bladia": "1168",
    "wilaya": "Bordj Bou Arreridj",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1140,
    "name": "El Kharrouba",
    "num_bladia": "1212",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1141,
    "name": "Dellys",
    "num_bladia": "1210",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1142,
    "name": "Ben Choud",
    "num_bladia": "1201",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1143,
    "name": "Afir",
    "num_bladia": "1198",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1144,
    "name": "Thenia",
    "num_bladia": "1226",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1145,
    "name": "Beni Amrane",
    "num_bladia": "1202",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1146,
    "name": "Khemis El Khechna",
    "num_bladia": "1215",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1147,
    "name": "Ammal",
    "num_bladia": "1199",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1148,
    "name": "Timezrit",
    "num_bladia": "1228",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1149,
    "name": "Zemmouri",
    "num_bladia": "1229",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1150,
    "name": "Larbatache",
    "num_bladia": "1216",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1151,
    "name": "Isser",
    "num_bladia": "1214",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1152,
    "name": "Chabet El Ameur",
    "num_bladia": "1208",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1153,
    "name": "Ouled Aissa",
    "num_bladia": "1219",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1154,
    "name": "Naciria",
    "num_bladia": "1218",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1155,
    "name": "Bouzegza Keddara",
    "num_bladia": "1207",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1156,
    "name": "Souk El Had",
    "num_bladia": "1224",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1157,
    "name": "Sidi Daoud",
    "num_bladia": "1223",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1158,
    "name": "Baghlia",
    "num_bladia": "1200",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1159,
    "name": "Leghata",
    "num_bladia": "1217",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1160,
    "name": "Djinet",
    "num_bladia": "1211",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1161,
    "name": "Tidjelabine",
    "num_bladia": "1227",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1162,
    "name": "Si Mustapha",
    "num_bladia": "1222",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1163,
    "name": "Ouled Hedadj",
    "num_bladia": "1220",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1164,
    "name": "Ouled Moussa",
    "num_bladia": "1221",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1165,
    "name": "Boumerdes",
    "num_bladia": "1206",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1166,
    "name": "Corso",
    "num_bladia": "1209",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1167,
    "name": "Bordj Menaiel",
    "num_bladia": "1203",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1168,
    "name": "Boudouaou",
    "num_bladia": "1204",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1169,
    "name": "Boudouaou El Bahri",
    "num_bladia": "1205",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1170,
    "name": "Taourga",
    "num_bladia": "1225",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1171,
    "name": "Hammedi",
    "num_bladia": "1213",
    "wilaya": "Boumerdès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1172,
    "name": "Ain El Assel",
    "num_bladia": "1230",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1173,
    "name": "Bougous",
    "num_bladia": "1236",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1174,
    "name": "El Tarf",
    "num_bladia": "1246",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1175,
    "name": "Zitouna",
    "num_bladia": "1253",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1176,
    "name": "Besbes",
    "num_bladia": "1235",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1177,
    "name": "Ain Kerma",
    "num_bladia": "1231",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1178,
    "name": "Bouhadjar",
    "num_bladia": "1237",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1179,
    "name": "Hammam Beni Salah",
    "num_bladia": "1247",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1180,
    "name": "Oued Zitoun",
    "num_bladia": "1249",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1181,
    "name": "Ben M Hidi",
    "num_bladia": "1233",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1182,
    "name": "Berrihane",
    "num_bladia": "1234",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1183,
    "name": "Chebaita Mokhtar",
    "num_bladia": "1239",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1184,
    "name": "Echatt",
    "num_bladia": "1243",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1185,
    "name": "El Aioun",
    "num_bladia": "1244",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1186,
    "name": "El Kala",
    "num_bladia": "1245",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1187,
    "name": "Souarekh",
    "num_bladia": "1251",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1188,
    "name": "Zerizer",
    "num_bladia": "1252",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1189,
    "name": "Bouteldja",
    "num_bladia": "1238",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1190,
    "name": "Chefia",
    "num_bladia": "1240",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1191,
    "name": "Lac Des Oiseaux",
    "num_bladia": "1248",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1192,
    "name": "Chihani",
    "num_bladia": "1241",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1193,
    "name": "Raml Souk",
    "num_bladia": "1250",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1194,
    "name": "Asfour",
    "num_bladia": "1232",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1195,
    "name": "Drean",
    "num_bladia": "1242",
    "wilaya": "El Tarf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1196,
    "name": "Tindouf",
    "num_bladia": "1255",
    "wilaya": "Tindouf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1197,
    "name": "Oum El Assel",
    "num_bladia": "1254",
    "wilaya": "Tindouf",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1198,
    "name": "Khemisti",
    "num_bladia": "1262",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1199,
    "name": "Theniet El Had",
    "num_bladia": "1275",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1200,
    "name": "Ouled Bessam",
    "num_bladia": "1269",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1201,
    "name": "Sidi Boutouchent",
    "num_bladia": "1271",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1202,
    "name": "Tissemsilt",
    "num_bladia": "1276",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1203,
    "name": "Sidi Lantri",
    "num_bladia": "1272",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1204,
    "name": "Beni Chaib",
    "num_bladia": "1257",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1205,
    "name": "Beni Lahcene",
    "num_bladia": "1258",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1206,
    "name": "Sidi Abed",
    "num_bladia": "1270",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1207,
    "name": "Sidi Slimane",
    "num_bladia": "1273",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1208,
    "name": "Boucaid",
    "num_bladia": "1261",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1209,
    "name": "Larbaa",
    "num_bladia": "1263",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1210,
    "name": "Lazharia",
    "num_bladia": "1266",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1211,
    "name": "Lardjem",
    "num_bladia": "1264",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1212,
    "name": "Melaab",
    "num_bladia": "1268",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1213,
    "name": "Layoune",
    "num_bladia": "1265",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1214,
    "name": "Tamellahet",
    "num_bladia": "1274",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1215,
    "name": "Youssoufia",
    "num_bladia": "1277",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1216,
    "name": "Bordj El Emir Abdelkader",
    "num_bladia": "1260",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1217,
    "name": "Ammari",
    "num_bladia": "1256",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1218,
    "name": "Maacem",
    "num_bladia": "1267",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1219,
    "name": "Bordj Bounaama",
    "num_bladia": "1259",
    "wilaya": "Tissemsilt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1220,
    "name": "Douar El Maa",
    "num_bladia": "1282",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1221,
    "name": "El Ogla",
    "num_bladia": "1283",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1222,
    "name": "Magrane",
    "num_bladia": "1291",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1223,
    "name": "Sidi Aoun",
    "num_bladia": "1301",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1224,
    "name": "Mih Ouansa",
    "num_bladia": "1292",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1225,
    "name": "Kouinine",
    "num_bladia": "1290",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1226,
    "name": "Bayadha",
    "num_bladia": "1278",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1227,
    "name": "Nakhla",
    "num_bladia": "1294",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1228,
    "name": "Robbah",
    "num_bladia": "1299",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1229,
    "name": "Guemar",
    "num_bladia": "1286",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1230,
    "name": "Ben Guecha",
    "num_bladia": "1279",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1231,
    "name": "Ourmes",
    "num_bladia": "1297",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1232,
    "name": "Taghzout",
    "num_bladia": "1304",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1233,
    "name": "Hamraia",
    "num_bladia": "1287",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1234,
    "name": "Reguiba",
    "num_bladia": "1298",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1235,
    "name": "Debila",
    "num_bladia": "1280",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1236,
    "name": "Hassani Abdelkrim",
    "num_bladia": "1288",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1237,
    "name": "Hassi Khalifa",
    "num_bladia": "1289",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1238,
    "name": "Trifaoui",
    "num_bladia": "1307",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1239,
    "name": "Taleb Larbi",
    "num_bladia": "1305",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1240,
    "name": "Oued El Alenda",
    "num_bladia": "1295",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1241,
    "name": "El-Oued",
    "num_bladia": "1285",
    "wilaya": "El Oued",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1242,
    "name": "Khirane",
    "num_bladia": "1321",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1243,
    "name": "Babar",
    "num_bladia": "1309",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1244,
    "name": "El Mahmal",
    "num_bladia": "1316",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1245,
    "name": "Ouled Rechache",
    "num_bladia": "1324",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1246,
    "name": "Djellal",
    "num_bladia": "1314",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1247,
    "name": "Yabous",
    "num_bladia": "1328",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1248,
    "name": "Khenchela",
    "num_bladia": "1320",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1249,
    "name": "Kais",
    "num_bladia": "1319",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1250,
    "name": "Chelia",
    "num_bladia": "1313",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1251,
    "name": "Remila",
    "num_bladia": "1325",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1252,
    "name": "Taouzianat",
    "num_bladia": "1327",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1253,
    "name": "Baghai",
    "num_bladia": "1310",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1254,
    "name": "El Hamma",
    "num_bladia": "1315",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1255,
    "name": "Ensigha",
    "num_bladia": "1318",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1256,
    "name": "Tamza",
    "num_bladia": "1326",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1257,
    "name": "Ain Touila",
    "num_bladia": "1308",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1258,
    "name": "M'toussa",
    "num_bladia": "1323",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1259,
    "name": "Bouhmama",
    "num_bladia": "1311",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1260,
    "name": "El Oueldja",
    "num_bladia": "1317",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1261,
    "name": "M'sara",
    "num_bladia": "1322",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1262,
    "name": "Chechar",
    "num_bladia": "1312",
    "wilaya": "Khenchela",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1263,
    "name": "Souk Ahras",
    "num_bladia": "1349",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1264,
    "name": "Ain Soltane",
    "num_bladia": "1329",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1265,
    "name": "Sedrata",
    "num_bladia": "1347",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1266,
    "name": "Hanencha",
    "num_bladia": "1334",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1267,
    "name": "Machroha",
    "num_bladia": "1337",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1268,
    "name": "Ain Zana",
    "num_bladia": "1330",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1269,
    "name": "Ouled Driss",
    "num_bladia": "1341",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1270,
    "name": "Terraguelt",
    "num_bladia": "1351",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1271,
    "name": "Oum El Adhaim",
    "num_bladia": "1343",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1272,
    "name": "Oued Kebrit",
    "num_bladia": "1340",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1273,
    "name": "Tiffech",
    "num_bladia": "1352",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1274,
    "name": "Ragouba",
    "num_bladia": "1345",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1275,
    "name": "Drea",
    "num_bladia": "1332",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1276,
    "name": "Taoura",
    "num_bladia": "1350",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1277,
    "name": "Zaarouria",
    "num_bladia": "1353",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1278,
    "name": "Haddada",
    "num_bladia": "1333",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1279,
    "name": "Khedara",
    "num_bladia": "1335",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1280,
    "name": "Ouled Moumen",
    "num_bladia": "1342",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1281,
    "name": "Merahna",
    "num_bladia": "1339",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1282,
    "name": "Ouillen",
    "num_bladia": "1344",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1283,
    "name": "Sidi Fredj",
    "num_bladia": "1348",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1284,
    "name": "Bir Bouhouche",
    "num_bladia": "1331",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1285,
    "name": "Safel El Ouiden",
    "num_bladia": "1346",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1286,
    "name": "Khemissa",
    "num_bladia": "1336",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1287,
    "name": "M'daourouche",
    "num_bladia": "1338",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1288,
    "name": "Zouabi",
    "num_bladia": "1354",
    "wilaya": "Souk Ahras",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1289,
    "name": "Hadjout",
    "num_bladia": "1369",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1290,
    "name": "Merad",
    "num_bladia": "1375",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1291,
    "name": "Menaceur",
    "num_bladia": "1374",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1292,
    "name": "Aghbal",
    "num_bladia": "1355",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1293,
    "name": "Nador",
    "num_bladia": "1377",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1294,
    "name": "Sidi-Amar",
    "num_bladia": "1381",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1295,
    "name": "Gouraya",
    "num_bladia": "1368",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1296,
    "name": "Messelmoun",
    "num_bladia": "1376",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1297,
    "name": "Cherchell",
    "num_bladia": "1364",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1298,
    "name": "Hadjret Ennous",
    "num_bladia": "1370",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1299,
    "name": "Sidi Ghiles",
    "num_bladia": "1378",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1300,
    "name": "Damous",
    "num_bladia": "1365",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1301,
    "name": "Larhat",
    "num_bladia": "1373",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1302,
    "name": "Fouka",
    "num_bladia": "1367",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1303,
    "name": "Ain Tagourait",
    "num_bladia": "1357",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1304,
    "name": "Bou Haroun",
    "num_bladia": "1360",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1305,
    "name": "Bou Ismail",
    "num_bladia": "1361",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1306,
    "name": "Khemisti",
    "num_bladia": "1371",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1307,
    "name": "Ahmer El Ain",
    "num_bladia": "1356",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1308,
    "name": "Bourkika",
    "num_bladia": "1362",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1309,
    "name": "Douaouda",
    "num_bladia": "1366",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1310,
    "name": "Sidi Rached",
    "num_bladia": "1379",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1311,
    "name": "Attatba",
    "num_bladia": "1358",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1312,
    "name": "Chaiba",
    "num_bladia": "1363",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1313,
    "name": "Kolea",
    "num_bladia": "1372",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1314,
    "name": "Sidi Semiane",
    "num_bladia": "1380",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1315,
    "name": "Tipaza",
    "num_bladia": "1382",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1316,
    "name": "Beni Mileuk",
    "num_bladia": "1359",
    "wilaya": "Tipaza",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1317,
    "name": "El Mechira",
    "num_bladia": "1394",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1318,
    "name": "El Ayadi Barbes",
    "num_bladia": "1393",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1319,
    "name": "Ain Beida Harriche",
    "num_bladia": "1384",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1320,
    "name": "Tassala Lematai",
    "num_bladia": "1411",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1321,
    "name": "Terrai Bainen",
    "num_bladia": "1410",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1322,
    "name": "Amira Arres",
    "num_bladia": "1387",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1323,
    "name": "Tassadane Haddada",
    "num_bladia": "1408",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1324,
    "name": "Minar Zarza",
    "num_bladia": "1399",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1325,
    "name": "Sidi Merouane",
    "num_bladia": "1406",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1326,
    "name": "Chigara",
    "num_bladia": "1391",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1327,
    "name": "Hamala",
    "num_bladia": "1397",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1328,
    "name": "Grarem Gouga",
    "num_bladia": "1396",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1329,
    "name": "Tiberguent",
    "num_bladia": "1412",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1330,
    "name": "Rouached",
    "num_bladia": "1404",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1331,
    "name": "Derrahi Bousselah",
    "num_bladia": "1392",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1332,
    "name": "Zeghaia",
    "num_bladia": "1414",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1333,
    "name": "Oued Endja",
    "num_bladia": "1401",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1334,
    "name": "Ahmed Rachedi",
    "num_bladia": "1383",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1335,
    "name": "Tadjenanet",
    "num_bladia": "1407",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1336,
    "name": "Ain Mellouk",
    "num_bladia": "1385",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1337,
    "name": "Ouled Khalouf",
    "num_bladia": "1403",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1338,
    "name": "Benyahia Abderrahmane",
    "num_bladia": "1388",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1339,
    "name": "Teleghma",
    "num_bladia": "1409",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1340,
    "name": "Oued Seguen",
    "num_bladia": "1402",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1341,
    "name": "Oued Athmenia",
    "num_bladia": "1400",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1342,
    "name": "Ain Tine",
    "num_bladia": "1386",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1343,
    "name": "Chelghoum Laid",
    "num_bladia": "1390",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1344,
    "name": "Yahia Beniguecha",
    "num_bladia": "1413",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1345,
    "name": "Ferdjioua",
    "num_bladia": "1395",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1346,
    "name": "Sidi Khelifa",
    "num_bladia": "1405",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1347,
    "name": "Mila",
    "num_bladia": "1398",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1348,
    "name": "Bouhatem",
    "num_bladia": "1389",
    "wilaya": "Mila",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1349,
    "name": "Khemis-Miliana",
    "num_bladia": "1440",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1350,
    "name": "Sidi-Lakhdar",
    "num_bladia": "1446",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1351,
    "name": "Ain-Benian",
    "num_bladia": "1415",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1352,
    "name": "Ain-Torki",
    "num_bladia": "1420",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1353,
    "name": "Hammam-Righa",
    "num_bladia": "1437",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1354,
    "name": "Bourached",
    "num_bladia": "1429",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1355,
    "name": "Hoceinia",
    "num_bladia": "1439",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1356,
    "name": "Djelida",
    "num_bladia": "1430",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1357,
    "name": "Arib",
    "num_bladia": "1421",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1358,
    "name": "Djemaa Ouled Cheikh",
    "num_bladia": "1431",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1359,
    "name": "El-Amra",
    "num_bladia": "1434",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1360,
    "name": "El-Attaf",
    "num_bladia": "1435",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1361,
    "name": "Tiberkanine",
    "num_bladia": "1449",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1362,
    "name": "Ain-Bouyahia",
    "num_bladia": "1416",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1363,
    "name": "El-Abadia",
    "num_bladia": "1433",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1364,
    "name": "Tacheta Zegagha",
    "num_bladia": "1447",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1365,
    "name": "Birbouche",
    "num_bladia": "1422",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1366,
    "name": "Djendel",
    "num_bladia": "1432",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1367,
    "name": "Ben Allal",
    "num_bladia": "1425",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1368,
    "name": "Oued Chorfa",
    "num_bladia": "1443",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1369,
    "name": "Boumedfaa",
    "num_bladia": "1428",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1370,
    "name": "Ain-Lechiakh",
    "num_bladia": "1418",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1371,
    "name": "Ain-Soltane",
    "num_bladia": "1419",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1372,
    "name": "Oued Djemaa",
    "num_bladia": "1444",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1373,
    "name": "El-Maine",
    "num_bladia": "1436",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1374,
    "name": "Rouina",
    "num_bladia": "1445",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1375,
    "name": "Zeddine",
    "num_bladia": "1450",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1376,
    "name": "Bir-Ould-Khelifa",
    "num_bladia": "1426",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1377,
    "name": "Bordj-Emir-Khaled",
    "num_bladia": "1427",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1378,
    "name": "Tarik-Ibn-Ziad",
    "num_bladia": "1448",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1379,
    "name": "Bathia",
    "num_bladia": "1423",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1380,
    "name": "Belaas",
    "num_bladia": "1424",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1381,
    "name": "Hassania",
    "num_bladia": "1438",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1382,
    "name": "Ain-Defla",
    "num_bladia": "1417",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1383,
    "name": "Miliana",
    "num_bladia": "1442",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1384,
    "name": "Mekhatria",
    "num_bladia": "1441",
    "wilaya": "Aïn Defla",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1385,
    "name": "Tiout",
    "num_bladia": "1462",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1386,
    "name": "Moghrar",
    "num_bladia": "1459",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1387,
    "name": "Asla",
    "num_bladia": "1453",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1388,
    "name": "Kasdir",
    "num_bladia": "1456",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1389,
    "name": "Makmen Ben Amar",
    "num_bladia": "1457",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1390,
    "name": "Ain Sefra",
    "num_bladia": "1452",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1391,
    "name": "Mecheria",
    "num_bladia": "1458",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1392,
    "name": "El Biodh",
    "num_bladia": "1455",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1393,
    "name": "Ain Ben Khelil",
    "num_bladia": "1451",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1394,
    "name": "Naama",
    "num_bladia": "1460",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1395,
    "name": "Djenienne Bourezg",
    "num_bladia": "1454",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1396,
    "name": "Sfissifa",
    "num_bladia": "1461",
    "wilaya": "Naâma",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1397,
    "name": "Sidi Boumediene",
    "num_bladia": "1486",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1398,
    "name": "Tamzoura",
    "num_bladia": "1489",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1399,
    "name": "Chaabat El Ham",
    "num_bladia": "1471",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1400,
    "name": "El Maleh",
    "num_bladia": "1474",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1401,
    "name": "Ouled Kihal",
    "num_bladia": "1483",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1402,
    "name": "Chentouf",
    "num_bladia": "1472",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1403,
    "name": "Terga",
    "num_bladia": "1490",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1404,
    "name": "Oued Sebbah",
    "num_bladia": "1481",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1405,
    "name": "El Amria",
    "num_bladia": "1473",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1406,
    "name": "Hassi El Ghella",
    "num_bladia": "1479",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1407,
    "name": "Ouled Boudjemaa",
    "num_bladia": "1482",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1408,
    "name": "Aghlal",
    "num_bladia": "1463",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1409,
    "name": "Ain Kihal",
    "num_bladia": "1465",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1410,
    "name": "Ain Tolba",
    "num_bladia": "1467",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1411,
    "name": "Aoubellil",
    "num_bladia": "1468",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1412,
    "name": "Beni Saf",
    "num_bladia": "1469",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1413,
    "name": "Hassasna",
    "num_bladia": "1478",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1414,
    "name": "Emir Abdelkader",
    "num_bladia": "1476",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1415,
    "name": "Sidi Safi",
    "num_bladia": "1488",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1416,
    "name": "Oulhaca El Gheraba",
    "num_bladia": "1484",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1417,
    "name": "Sidi Ouriache",
    "num_bladia": "1487",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1418,
    "name": "Ain El Arbaa",
    "num_bladia": "1464",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1419,
    "name": "El Messaid",
    "num_bladia": "1475",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1420,
    "name": "Oued Berkeche",
    "num_bladia": "1480",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1421,
    "name": "Sidi Ben Adda",
    "num_bladia": "1485",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1422,
    "name": "Ain Temouchent",
    "num_bladia": "1466",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1423,
    "name": "Bouzedjar",
    "num_bladia": "1470",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1424,
    "name": "Hammam Bou Hadjar",
    "num_bladia": "1477",
    "wilaya": "Aïn Témouchent",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1425,
    "name": "Dhayet Bendhahoua",
    "num_bladia": "1493",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1426,
    "name": "Mansoura",
    "num_bladia": "1500",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1427,
    "name": "El Atteuf",
    "num_bladia": "1494",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1428,
    "name": "Bounoura",
    "num_bladia": "1492",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1429,
    "name": "Zelfana",
    "num_bladia": "1503",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1430,
    "name": "El Guerrara",
    "num_bladia": "1497",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1431,
    "name": "Sebseb",
    "num_bladia": "1502",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1432,
    "name": "Metlili",
    "num_bladia": "1501",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1433,
    "name": "Berriane",
    "num_bladia": "1491",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1434,
    "name": "Ghardaia",
    "num_bladia": "1496",
    "wilaya": "Ghardaïa",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1435,
    "name": "El-Guettar",
    "num_bladia": "1516",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1436,
    "name": "Ouled Aiche",
    "num_bladia": "1530",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1437,
    "name": "Beni Dergoun",
    "num_bladia": "1509",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1438,
    "name": "Dar Ben Abdelah",
    "num_bladia": "1511",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1439,
    "name": "Zemmoura",
    "num_bladia": "1541",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1440,
    "name": "Djidiouia",
    "num_bladia": "1512",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1441,
    "name": "Hamri",
    "num_bladia": "1519",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1442,
    "name": "Belaassel Bouzagza",
    "num_bladia": "1507",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1443,
    "name": "El-Matmar",
    "num_bladia": "1517",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1444,
    "name": "Sidi Khettab",
    "num_bladia": "1534",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1445,
    "name": "Sidi M'hamed Benaouda",
    "num_bladia": "1537",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1446,
    "name": "Ain-Tarek",
    "num_bladia": "1505",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1447,
    "name": "Had Echkalla",
    "num_bladia": "1518",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1448,
    "name": "El Ouldja",
    "num_bladia": "1515",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1449,
    "name": "Mazouna",
    "num_bladia": "1522",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1450,
    "name": "Ain Rahma",
    "num_bladia": "1504",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1451,
    "name": "Kalaa",
    "num_bladia": "1520",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1452,
    "name": "Sidi Saada",
    "num_bladia": "1538",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1453,
    "name": "Yellel",
    "num_bladia": "1540",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1454,
    "name": "Souk El Had",
    "num_bladia": "1539",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1455,
    "name": "Mendes",
    "num_bladia": "1524",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1456,
    "name": "Oued Essalem",
    "num_bladia": "1528",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1457,
    "name": "Sidi Lazreg",
    "num_bladia": "1535",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1458,
    "name": "Ammi Moussa",
    "num_bladia": "1506",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1459,
    "name": "Ouarizane",
    "num_bladia": "1526",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1460,
    "name": "Merdja Sidi Abed",
    "num_bladia": "1525",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1461,
    "name": "Ouled Sidi Mihoub",
    "num_bladia": "1531",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1462,
    "name": "Bendaoud",
    "num_bladia": "1508",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1463,
    "name": "Oued-Rhiou",
    "num_bladia": "1529",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1464,
    "name": "El Hassi",
    "num_bladia": "1513",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1465,
    "name": "Sidi M'hamed Benali",
    "num_bladia": "1536",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1466,
    "name": "Mediouna",
    "num_bladia": "1523",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1467,
    "name": "Beni Zentis",
    "num_bladia": "1510",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1468,
    "name": "Oued El Djemaa",
    "num_bladia": "1527",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1469,
    "name": "Lahlef",
    "num_bladia": "1521",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1470,
    "name": "Relizane",
    "num_bladia": "1533",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1471,
    "name": "El H'madna",
    "num_bladia": "1514",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1472,
    "name": "Ramka",
    "num_bladia": "1532",
    "wilaya": "Relizane",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1473,
    "name": "Tinerkouk",
    "num_bladia": "25",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1474,
    "name": "Timimoun",
    "num_bladia": "24",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1475,
    "name": "Ouled Said",
    "num_bladia": "15",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1476,
    "name": "Metarfa",
    "num_bladia": "12",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1477,
    "name": "Talmine",
    "num_bladia": "19",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1478,
    "name": "Ouled Aissa",
    "num_bladia": "14",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1479,
    "name": "Charouine",
    "num_bladia": "07",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1480,
    "name": "Aougrout",
    "num_bladia": "03",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1481,
    "name": "Deldoul",
    "num_bladia": "08",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1482,
    "name": "Ksar Kaddour",
    "num_bladia": "11",
    "wilaya": "Timimoun",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1483,
    "name": "Timiaouine",
    "num_bladia": "23",
    "wilaya": "Bordj Badji Mokhtar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1484,
    "name": "Bordj Badji Mokhtar",
    "num_bladia": "05",
    "wilaya": "Bordj Badji Mokhtar",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1485,
    "name": "Ras El Miad",
    "num_bladia": "258",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1486,
    "name": "Besbes",
    "num_bladia": "232",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1487,
    "name": "Sidi Khaled",
    "num_bladia": "259",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1488,
    "name": "Doucen",
    "num_bladia": "240",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1489,
    "name": "Chaiba",
    "num_bladia": "237",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1490,
    "name": "Ouled Djellal",
    "num_bladia": "255",
    "wilaya": "Ouled Djellal",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1491,
    "name": "Beni-Abbes",
    "num_bladia": "265",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1492,
    "name": "Tamtert",
    "num_bladia": "282",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1493,
    "name": "Igli",
    "num_bladia": "271",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1494,
    "name": "El Ouata",
    "num_bladia": "269",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1495,
    "name": "Ouled-Khodeir",
    "num_bladia": "279",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1496,
    "name": "Kerzaz",
    "num_bladia": "273",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1497,
    "name": "Timoudi",
    "num_bladia": "283",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1498,
    "name": "Ksabi",
    "num_bladia": "274",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1499,
    "name": "Beni-Ikhlef",
    "num_bladia": "266",
    "wilaya": "Béni Abbès",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1500,
    "name": "Inghar",
    "num_bladia": "360",
    "wilaya": "In Salah",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1501,
    "name": "Ain Salah",
    "num_bladia": "357",
    "wilaya": "In Salah",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1502,
    "name": "Foggaret Ezzoua",
    "num_bladia": "358",
    "wilaya": "In Salah",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1503,
    "name": "Tin Zouatine",
    "num_bladia": "363",
    "wilaya": "In Guezzam",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1504,
    "name": "Ain Guezzam",
    "num_bladia": "356",
    "wilaya": "In Guezzam",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1505,
    "name": "Temacine",
    "num_bladia": "1107",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1506,
    "name": "Sidi Slimane",
    "num_bladia": "1104",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1507,
    "name": "Megarine",
    "num_bladia": "1097",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1508,
    "name": "Nezla",
    "num_bladia": "1099",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1509,
    "name": "Blidet Amor",
    "num_bladia": "1091",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1510,
    "name": "Tebesbest",
    "num_bladia": "1106",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1511,
    "name": "Touggourt",
    "num_bladia": "1108",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1512,
    "name": "Taibet",
    "num_bladia": "1105",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1513,
    "name": "El Alia",
    "num_bladia": "1092",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1514,
    "name": "El-Hadjira",
    "num_bladia": "1094",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1515,
    "name": "Benaceur",
    "num_bladia": "1090",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1516,
    "name": "M'naguer",
    "num_bladia": "1098",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1517,
    "name": "Zaouia El Abidia",
    "num_bladia": "1109",
    "wilaya": "Touggourt",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1518,
    "name": "Djanet",
    "num_bladia": "1161",
    "wilaya": "Djanet",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1519,
    "name": "Bordj El Haouass",
    "num_bladia": "1158",
    "wilaya": "Djanet",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1520,
    "name": "Oum Touyour",
    "num_bladia": "1296",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1521,
    "name": "Sidi Amrane",
    "num_bladia": "1300",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1522,
    "name": "M'rara",
    "num_bladia": "1293",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1523,
    "name": "Djamaa",
    "num_bladia": "1281",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1524,
    "name": "Tenedla",
    "num_bladia": "1306",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1525,
    "name": "El-M'ghaier",
    "num_bladia": "1284",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1526,
    "name": "Still",
    "num_bladia": "1303",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1527,
    "name": "Sidi Khelil",
    "num_bladia": "1302",
    "wilaya": "El Meghaier",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1528,
    "name": "El Meniaa",
    "num_bladia": "1495",
    "wilaya": "El Menia",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1529,
    "name": "Hassi Gara",
    "num_bladia": "1499",
    "wilaya": "El Menia",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1530,
    "name": "Hassi Fehal",
    "num_bladia": "1498",
    "wilaya": "El Menia",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1531,
    "name": "Aflou",
    "num_bladia": "01",
    "wilaya": "Aflou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1532,
    "name": "Sebgag",
    "num_bladia": "02",
    "wilaya": "Aflou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1533,
    "name": "Sidi Bouzid",
    "num_bladia": "03",
    "wilaya": "Aflou",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1534,
    "name": "Barika",
    "num_bladia": "01",
    "wilaya": "Barika",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1535,
    "name": "M'doukel",
    "num_bladia": "02",
    "wilaya": "Barika",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1536,
    "name": "Bitam",
    "num_bladia": "03",
    "wilaya": "Barika",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1537,
    "name": "Ksar Chellala",
    "num_bladia": "01",
    "wilaya": "Ksar Chellala",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1538,
    "name": "Serghine",
    "num_bladia": "02",
    "wilaya": "Ksar Chellala",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1539,
    "name": "Zmalet El Emir Abdelkader",
    "num_bladia": "03",
    "wilaya": "Ksar Chellala",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1540,
    "name": "Messaad",
    "num_bladia": "01",
    "wilaya": "Messaad",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1541,
    "name": "Deldoul",
    "num_bladia": "02",
    "wilaya": "Messaad",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1542,
    "name": "Selmana",
    "num_bladia": "03",
    "wilaya": "Messaad",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1543,
    "name": "Sed Rahal",
    "num_bladia": "04",
    "wilaya": "Messaad",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1544,
    "name": "Guettara",
    "num_bladia": "05",
    "wilaya": "Messaad",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1545,
    "name": "Aïn Oussera",
    "num_bladia": "01",
    "wilaya": "Aïn Oussera",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1546,
    "name": "Guernini",
    "num_bladia": "02",
    "wilaya": "Aïn Oussera",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1547,
    "name": "Boussaâda",
    "num_bladia": "01",
    "wilaya": "Boussaâda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1548,
    "name": "El Hamel",
    "num_bladia": "02",
    "wilaya": "Boussaâda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1549,
    "name": "Oultem",
    "num_bladia": "03",
    "wilaya": "Boussaâda",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1550,
    "name": "El Abiodh Sidi Cheikh",
    "num_bladia": "01",
    "wilaya": "El Abiodh Sidi Cheikh",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1551,
    "name": "El Kantara",
    "num_bladia": "01",
    "wilaya": "El Kantara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1552,
    "name": "Aïn Zaatout",
    "num_bladia": "02",
    "wilaya": "El Kantara",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1553,
    "name": "Bir El Ater",
    "num_bladia": "01",
    "wilaya": "Bir El Ater",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1554,
    "name": "Ogla Melha",
    "num_bladia": "02",
    "wilaya": "Bir El Ater",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1555,
    "name": "Ksar El Boukhari",
    "num_bladia": "01",
    "wilaya": "Ksar El Boukhari",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1556,
    "name": "Meftaha",
    "num_bladia": "02",
    "wilaya": "Ksar El Boukhari",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1557,
    "name": "Saneg",
    "num_bladia": "03",
    "wilaya": "Ksar El Boukhari",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1558,
    "name": "El Aricha",
    "num_bladia": "01",
    "wilaya": "El Aricha",
    "centers": 4,
    "desks": 20
  },
  {
    "id": 1559,
    "name": "El Gor",
    "num_bladia": "02",
    "wilaya": "El Aricha",
    "centers": 4,
    "desks": 20
  }
]);;

  const [centersData, setCentersData] = useState([
    { id: 1, name: "Centre Pasteur", location: "Rue Didouche Mourad", male: 2400, female: 2400, total: 4800, numbers_desks: 12 },
    { id: 2, name: "Centre Ibn Badis", location: "Place du 1er Mai", male: 1600, female: 1600, total: 3200, numbers_desks: 8 },
    { id: 3, name: "Centre Emir Abdelkader", location: "Boulevard des Martyrs", male: 2000, female: 2000, total: 4000, numbers_desks: 10 },
  ]);

  const [desksData, setDesksData] = useState([
    { id: 1, num_desk: "01", center: "Centre Pasteur", male: 200, female: 200, total: 400 },
    { id: 2, num_desk: "02", center: "Centre Pasteur", male: 150, female: 150, total: 300 },
    { id: 3, num_desk: "01", center: "Centre Ibn Badis", male: 250, female: 230, total: 480 },
  ]);

  const [partiesData, setPartiesData] = useState([
    { id: 1, name: "Front de Libération Nationale", short: "FLN", leader: "Abou El Fadhel Baadji", wilaya_siege: "Alger" },
    { id: 2, name: "Rassemblement National Démocratique", short: "RND", leader: "Mustapha Yahi", wilaya_siege: "Alger" },
    { id: 3, name: "Mouvement de la Société pour la Paix", short: "MSP", leader: "Abdelali Hassani Cherif", wilaya_siege: "Alger" },
    { id: 4, name: "Front des Forces Socialistes", short: "FFS", leader: "Youcef Aouchiche", wilaya_siege: "Tizi Ouzou" },
    { id: 5, name: "Parti des Travailleurs", short: "PT", leader: "Louisa Hanoune", wilaya_siege: "Alger" },
    { id: 6, name: "Jil Jadid", short: "JJ", leader: "Soufiane Djilali", wilaya_siege: "Alger" },
  ]);

  const [candidatesData, setCandidatesData] = useState([
    { id: 1, full_name: "Abdelmadjid Tebboune", party: "Indépendant", wilaya: "Alger", nin: "194511171600123456", phone: "0550112233", birthday: "1945-11-17", fav: true, result: 0 },
    { id: 2, full_name: "Youcef Aouchiche", party: "FFS", wilaya: "Tizi Ouzou", nin: "198301291500456789", phone: "0550445566", birthday: "1983-01-29", fav: false, result: 0 },
    { id: 3, full_name: "Abdelali Hassani Cherif", party: "MSP", wilaya: "M'Sila", nin: "196603152800789123", phone: "0550778899", birthday: "1966-03-15", fav: false, result: 0 },
    { id: 4, full_name: "Louisa Hanoune", party: "PT", wilaya: "Alger", nin: "195404071600234567", phone: "0661223344", birthday: "1954-04-07", fav: false, result: 0 },
    { id: 5, full_name: "Ali Benflis", party: "Indépendant", wilaya: "Batna", nin: "194409080500345678", phone: "0770556677", birthday: "1944-09-08", fav: true, result: 0 },
  ]);

  const [adminsData, setAdminsData] = useState([
    { id: 1, name: "Mohamed Benali", email: "m.benali@anie.dz", nin: "197516010012345678", phone: "0550123456", role: "Super Admin", status: "Actif", wilaya: "Alger" },
    { id: 2, name: "Zohra Mansouri", email: "z.mansouri@anie.dz", nin: "198009010098765432", phone: "0550987654", role: "Admin Wilaya (Blida)", status: "Actif", wilaya: "Blida" },
    { id: 3, name: "Abdelkader Brahimi", email: "a.brahimi@anie.dz", nin: "197231010055555555", phone: "0550555555", role: "Admin Baladia (Oran)", status: "Actif", wilaya: "Oran" },
    { id: 4, name: "Amine Khelladi", email: "a.khelladi@anie.dz", nin: "198825010022334455", phone: "0661223344", role: "Admin Wilaya (Constantine)", status: "Actif", wilaya: "Constantine" },
  ]);

  const [membersData, setMembersData] = useState([
    { id: 1, name: "Yassine Belmadi", email: "y.belmadi@gmail.com", nin: "199016010011122233", phone: "0660112233", birthday: "1990-05-20", party: "FLN", goal: "Supervision du centre Pasteur", location: "Alger", admin_commun: "Mohamed Benali", status: "Permanent" },
    { id: 2, name: "Lydia Bensaïd", email: "l.bensaid@outlook.com", nin: "199509010077788899", phone: "0660998877", birthday: "1995-11-12", party: "MSP", goal: "Contrôle des listes électorales", location: "Blida", admin_commun: "Zohra Mansouri", status: "Permanent" },
    { id: 3, name: "Ryad Mahrez", email: "r.mahrez@gmail.com", nin: "199131010033445566", phone: "0770334455", birthday: "1991-02-21", party: "FFS", goal: "Observateur de bureau", location: "Oran", admin_commun: "Abdelkader Brahimi", status: "Permanent" },
  ]);

  const [observersData, setObserversData] = useState([
    { id: 1, name: "Karim Slimani", role: "Observateur Bureau", center: "Centre Pasteur", desk: "08", location: "Centre Pasteur - Bureau 08", code: "TMP-882-X", status: "Actif", expires: "20:00", email: "k.slimani@gmail.com", nin: "198516010011223344", phone: "0550112233" },
    { id: 2, name: "Sara Haddad", role: "Chef de Centre", center: "Centre Ibn Badis", desk: "N/A", location: "Centre Ibn Badis", code: "TMP-441-Y", status: "Actif", expires: "22:00", email: "s.haddad@gmail.com", nin: "199216010044556677", phone: "0550445566" },
    { id: 3, name: "Ahmed Mansour", role: "Observateur Centre", center: "Centre Emir Abdelkader", desk: "N/A", location: "Centre Emir Abdelkader", code: "TMP-901-Z", status: "Expiré", expires: "08:00 (Fermé)", email: "a.mansour@gmail.com", nin: "197816010077889900", phone: "0550778899" },
    { id: 4, name: "Leila Bekhti", role: "Observateur Bureau", center: "Centre Pasteur", desk: "02", location: "Centre Pasteur - Bureau 02", code: "TMP-112-A", status: "Actif", expires: "20:00", email: "l.bekhti@gmail.com", nin: "199516010022334455", phone: "0661223344" },
  ]);

  const [electionScope, setElectionScope] = useState<ElectionScope>("national");

  return (
    <DataContext.Provider value={{
      wilayasData, setWilayasData,
      communesData, setCommunesData,
      centersData, setCentersData,
      desksData, setDesksData,
      partiesData, setPartiesData,
      candidatesData, setCandidatesData,
      adminsData, setAdminsData,
      membersData, setMembersData,
      observersData, setObserversData,
      electionScope, setElectionScope
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
