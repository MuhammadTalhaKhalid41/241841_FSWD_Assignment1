const STORAGE_KEY = "supportflow_tickets";

const seedTickets = [
  {
    id: "T-1001",
    customerName: "Ayesha Malik",
    issue: "Unable to reset account password",
    priority: "High",
    status: "Open",
    createdAt: "2026-10-21T09:30:00"
  },
  {
    id: "T-1002",
    customerName: "Hamza Ahmed",
    issue: "Invoice download shows an error",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-10-22T11:15:00"
  },
  {
    id: "T-1003",
    customerName: "Sara Khan",
    issue: "Question about subscription renewal",
    priority: "Low",
    status: "Closed",
    createdAt: "2026-10-23T14:20:00"
  }
];

export const loadTickets = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : seedTickets;
};

export const saveTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const clearTicketsStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
