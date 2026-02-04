import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlockchainLedger } from '../utils/blockchain';

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  leaveType: 'sick' | 'personal' | 'emergency' | 'other';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'hackathon' | 'workshop' | 'fest' | 'seminar' | 'competition';
  description: string;
  date: string;
  venue: string;
  organizer: string;
  capacity: number;
  registered: number;
  registrations: string[]; // Array of student IDs
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  year: number;
  type: 'notes' | 'past-papers' | 'reference' | 'tutorial';
  uploadedBy: string;
  uploadedById: string;
  uploadDate: string;
  fileUrl: string;
  downloads: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  period: number;
}

export interface TimeTableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  department: string;
  year: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'urgent';
  postedBy: string;
  postedById: string;
  postedDate: string;
  targetAudience: 'all' | 'students' | 'faculty';
  department?: string;
  year?: number;
}

export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: 'academic' | 'sports' | 'cultural' | 'technical' | 'social';
  date: string;
  certificateUrl?: string;
  verifiedBy: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  semester: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentDate?: string;
  transactionId?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  semester: string;
  subject: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  credits: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'leave' | 'event' | 'announcement' | 'fee' | 'grade' | 'achievement';
  read: boolean;
  timestamp: string;
  link?: string;
}

interface DataContextType {
  leaves: LeaveApplication[];
  events: Event[];
  resources: StudyResource[];
  attendance: AttendanceRecord[];
  timetable: TimeTableEntry[];
  announcements: Announcement[];
  achievements: Achievement[];
  fees: FeeRecord[];
  grades: GradeRecord[];
  notifications: Notification[];
  blockchain: BlockchainLedger;
  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'appliedDate' | 'status'>) => void;
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected', reviewedBy: string, comments?: string) => void;
  registerForEvent: (eventId: string, studentId: string, studentName: string) => void;
  uploadResource: (resource: Omit<StudyResource, 'id' | 'uploadDate' | 'downloads'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'postedDate'>) => void;
  markNotificationRead: (notificationId: string) => void;
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialLeaves: LeaveApplication[] = [
  {
    id: 'leave-001',
    studentId: 'student-001',
    studentName: 'Thirumalai.C',
    registerNumber: '711524BCS177',
    leaveType: 'sick',
    fromDate: '2026-02-10',
    toDate: '2026-02-12',
    reason: 'Medical appointment and recovery',
    status: 'approved',
    appliedDate: '2026-02-03',
    reviewedBy: 'Dr. Ramesh Kumar',
    reviewedDate: '2026-02-04',
    comments: 'Approved. Please submit medical certificate upon return.',
  },
  {
    id: 'leave-002',
    studentId: 'student-002',
    studentName: 'Priya Sharma',
    registerNumber: '711524BCS145',
    leaveType: 'personal',
    fromDate: '2026-02-15',
    toDate: '2026-02-16',
    reason: 'Family function',
    status: 'pending',
    appliedDate: '2026-02-04',
  },
];

const initialEvents: Event[] = [
  {
    id: 'event-001',
    title: 'Smart India Hackathon 2026',
    type: 'hackathon',
    description: 'National level hackathon to solve real-world problems using technology. Build innovative solutions in 36 hours.',
    date: '2026-03-15',
    venue: 'Computer Science Block',
    organizer: 'Technical Club',
    capacity: 100,
    registered: 45,
    registrations: ['student-001', 'student-002'],
    status: 'upcoming',
  },
  {
    id: 'event-002',
    title: 'Web Development Workshop',
    type: 'workshop',
    description: 'Learn modern web development with React, Node.js, and MongoDB. Hands-on workshop with industry experts.',
    date: '2026-02-20',
    venue: 'Lab 301',
    organizer: 'Dr. Ramesh Kumar',
    capacity: 50,
    registered: 32,
    registrations: ['student-001'],
    status: 'upcoming',
  },
  {
    id: 'event-003',
    title: 'Annual Tech Fest - CodeFiesta 2026',
    type: 'fest',
    description: 'Three-day technical festival with coding competitions, tech talks, and cultural events.',
    date: '2026-04-01',
    venue: 'Main Auditorium',
    organizer: 'Student Council',
    capacity: 500,
    registered: 234,
    registrations: ['student-001', 'student-002'],
    status: 'upcoming',
  },
  {
    id: 'event-004',
    title: 'AI/ML Seminar',
    type: 'seminar',
    description: 'Guest lecture on latest trends in Artificial Intelligence and Machine Learning by industry expert from Google.',
    date: '2026-02-25',
    venue: 'Seminar Hall',
    organizer: 'CS Department',
    capacity: 200,
    registered: 156,
    registrations: [],
    status: 'upcoming',
  },
];

const initialResources: StudyResource[] = [
  {
    id: 'resource-001',
    title: 'Data Structures Complete Notes',
    description: 'Comprehensive notes covering all topics: Arrays, Linked Lists, Trees, Graphs, Sorting, and Searching algorithms.',
    subject: 'Data Structures',
    department: 'Computer Science',
    year: 2,
    type: 'notes',
    uploadedBy: 'Thirumalai.C',
    uploadedById: 'student-001',
    uploadDate: '2026-01-15',
    fileUrl: '#',
    downloads: 87,
  },
  {
    id: 'resource-002',
    title: 'DBMS Past Year Papers (2020-2025)',
    description: 'Collection of previous year question papers with solutions for Database Management Systems.',
    subject: 'Database Management',
    department: 'Computer Science',
    year: 3,
    type: 'past-papers',
    uploadedBy: 'Priya Sharma',
    uploadedById: 'student-002',
    uploadDate: '2026-01-20',
    fileUrl: '#',
    downloads: 123,
  },
  {
    id: 'resource-003',
    title: 'Operating Systems Tutorial Videos',
    description: 'Step-by-step video tutorials on OS concepts, process management, memory management, and file systems.',
    subject: 'Operating Systems',
    department: 'Computer Science',
    year: 3,
    type: 'tutorial',
    uploadedBy: 'Dr. Ramesh Kumar',
    uploadedById: 'faculty-001',
    uploadDate: '2026-01-25',
    fileUrl: '#',
    downloads: 201,
  },
  {
    id: 'resource-004',
    title: 'Java Programming Reference Guide',
    description: 'Complete reference guide for Java programming with examples and best practices.',
    subject: 'Java Programming',
    department: 'Computer Science',
    year: 2,
    type: 'reference',
    uploadedBy: 'Thirumalai.C',
    uploadedById: 'student-001',
    uploadDate: '2026-02-01',
    fileUrl: '#',
    downloads: 56,
  },
];

const initialAttendance: AttendanceRecord[] = [
  // Thirumalai.C attendance records
  { id: 'att-001', studentId: 'student-001', subject: 'Data Structures', date: '2026-02-03', status: 'present', period: 1 },
  { id: 'att-002', studentId: 'student-001', subject: 'Database Management', date: '2026-02-03', status: 'present', period: 2 },
  { id: 'att-003', studentId: 'student-001', subject: 'Operating Systems', date: '2026-02-03', status: 'present', period: 3 },
  { id: 'att-004', studentId: 'student-001', subject: 'Data Structures', date: '2026-02-04', status: 'present', period: 1 },
  { id: 'att-005', studentId: 'student-001', subject: 'Web Technologies', date: '2026-02-04', status: 'late', period: 4 },
  { id: 'att-006', studentId: 'student-001', subject: 'Database Management', date: '2026-01-30', status: 'absent', period: 2 },
  { id: 'att-007', studentId: 'student-001', subject: 'Operating Systems', date: '2026-01-31', status: 'present', period: 3 },
];

const initialTimetable: TimeTableEntry[] = [
  // Year 3 Computer Science Timetable
  { id: 'tt-001', day: 'Monday', period: 1, subject: 'Data Structures', faculty: 'Dr. Ramesh Kumar', room: 'CS-301', startTime: '09:00', endTime: '10:00', department: 'Computer Science', year: 3 },
  { id: 'tt-002', day: 'Monday', period: 2, subject: 'Database Management', faculty: 'Prof. Priya Singh', room: 'CS-302', startTime: '10:15', endTime: '11:15', department: 'Computer Science', year: 3 },
  { id: 'tt-003', day: 'Monday', period: 3, subject: 'Operating Systems', faculty: 'Dr. Amit Patel', room: 'CS-303', startTime: '11:30', endTime: '12:30', department: 'Computer Science', year: 3 },
  { id: 'tt-004', day: 'Monday', period: 4, subject: 'Web Technologies Lab', faculty: 'Dr. Ramesh Kumar', room: 'Lab-201', startTime: '13:30', endTime: '15:30', department: 'Computer Science', year: 3 },
  
  { id: 'tt-005', day: 'Tuesday', period: 1, subject: 'Computer Networks', faculty: 'Prof. Sarah Johnson', room: 'CS-301', startTime: '09:00', endTime: '10:00', department: 'Computer Science', year: 3 },
  { id: 'tt-006', day: 'Tuesday', period: 2, subject: 'Software Engineering', faculty: 'Dr. Ramesh Kumar', room: 'CS-302', startTime: '10:15', endTime: '11:15', department: 'Computer Science', year: 3 },
  { id: 'tt-007', day: 'Tuesday', period: 3, subject: 'Data Structures', faculty: 'Dr. Ramesh Kumar', room: 'CS-303', startTime: '11:30', endTime: '12:30', department: 'Computer Science', year: 3 },
  
  { id: 'tt-008', day: 'Wednesday', period: 1, subject: 'Database Management', faculty: 'Prof. Priya Singh', room: 'CS-301', startTime: '09:00', endTime: '10:00', department: 'Computer Science', year: 3 },
  { id: 'tt-009', day: 'Wednesday', period: 2, subject: 'Operating Systems', faculty: 'Dr. Amit Patel', room: 'CS-302', startTime: '10:15', endTime: '11:15', department: 'Computer Science', year: 3 },
  { id: 'tt-010', day: 'Wednesday', period: 4, subject: 'DBMS Lab', faculty: 'Prof. Priya Singh', room: 'Lab-202', startTime: '13:30', endTime: '15:30', department: 'Computer Science', year: 3 },
  
  { id: 'tt-011', day: 'Thursday', period: 1, subject: 'Web Technologies', faculty: 'Dr. Ramesh Kumar', room: 'CS-301', startTime: '09:00', endTime: '10:00', department: 'Computer Science', year: 3 },
  { id: 'tt-012', day: 'Thursday', period: 2, subject: 'Computer Networks', faculty: 'Prof. Sarah Johnson', room: 'CS-302', startTime: '10:15', endTime: '11:15', department: 'Computer Science', year: 3 },
  { id: 'tt-013', day: 'Thursday', period: 3, subject: 'Software Engineering', faculty: 'Dr. Ramesh Kumar', room: 'CS-303', startTime: '11:30', endTime: '12:30', department: 'Computer Science', year: 3 },
  
  { id: 'tt-014', day: 'Friday', period: 1, subject: 'Data Structures', faculty: 'Dr. Ramesh Kumar', room: 'CS-301', startTime: '09:00', endTime: '10:00', department: 'Computer Science', year: 3 },
  { id: 'tt-015', day: 'Friday', period: 2, subject: 'Database Management', faculty: 'Prof. Priya Singh', room: 'CS-302', startTime: '10:15', endTime: '11:15', department: 'Computer Science', year: 3 },
  { id: 'tt-016', day: 'Friday', period: 3, subject: 'Seminar', faculty: 'Various', room: 'Seminar Hall', startTime: '11:30', endTime: '12:30', department: 'Computer Science', year: 3 },
];

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Mid-Semester Examinations Schedule Released',
    content: 'The mid-semester examination schedule has been released. Exams will begin from February 20, 2026. Please check the notice board for detailed timetable.',
    type: 'academic',
    postedBy: 'Admin User',
    postedById: 'admin-001',
    postedDate: '2026-02-01',
    targetAudience: 'students',
  },
  {
    id: 'ann-002',
    title: 'Tech Fest Registration Now Open!',
    content: 'CodeFiesta 2026 registration is now open! Register for coding competitions, hackathons, and technical workshops. Limited seats available.',
    type: 'event',
    postedBy: 'Student Council',
    postedById: 'admin-001',
    postedDate: '2026-02-02',
    targetAudience: 'all',
  },
  {
    id: 'ann-003',
    title: 'Library Timing Changes',
    content: 'Library will remain open until 10 PM on weekdays starting from this week to support exam preparation.',
    type: 'general',
    postedBy: 'Library Administration',
    postedById: 'admin-001',
    postedDate: '2026-02-03',
    targetAudience: 'all',
  },
  {
    id: 'ann-004',
    title: 'URGENT: Class Postponed',
    content: 'Web Technologies class scheduled for today at 2 PM is postponed to tomorrow same time due to faculty emergency.',
    type: 'urgent',
    postedBy: 'Dr. Ramesh Kumar',
    postedById: 'faculty-001',
    postedDate: '2026-02-04',
    targetAudience: 'students',
    department: 'Computer Science',
    year: 3,
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'ach-001',
    studentId: 'student-001',
    studentName: 'Thirumalai.C',
    title: 'First Prize - Inter-College Coding Competition',
    description: 'Won first prize in the state-level inter-college coding competition organized by Anna University.',
    category: 'technical',
    date: '2025-12-15',
    verifiedBy: 'Dr. Ramesh Kumar',
  },
  {
    id: 'ach-002',
    studentId: 'student-001',
    studentName: 'Thirumalai.C',
    title: 'Best Project Award - Mini Project Exhibition',
    description: 'Received best project award for developing an AI-powered campus management system.',
    category: 'academic',
    date: '2026-01-10',
    verifiedBy: 'Prof. Priya Singh',
  },
  {
    id: 'ach-003',
    studentId: 'student-001',
    studentName: 'Thirumalai.C',
    title: 'Participated in Smart India Hackathon 2025',
    description: 'Successfully participated in Smart India Hackathon representing the college.',
    category: 'technical',
    date: '2025-11-20',
    verifiedBy: 'Dr. Ramesh Kumar',
  },
];

const initialFees: FeeRecord[] = [
  {
    id: 'fee-001',
    studentId: 'student-001',
    semester: 'Semester 5',
    amount: 45000,
    paidAmount: 45000,
    dueDate: '2025-08-15',
    status: 'paid',
    paymentDate: '2025-08-10',
    transactionId: 'TXN20250810001',
  },
  {
    id: 'fee-002',
    studentId: 'student-001',
    semester: 'Semester 6',
    amount: 45000,
    paidAmount: 45000,
    dueDate: '2026-01-15',
    status: 'paid',
    paymentDate: '2026-01-12',
    transactionId: 'TXN20260112001',
  },
  {
    id: 'fee-003',
    studentId: 'student-001',
    semester: 'Semester 7 (Current)',
    amount: 45000,
    paidAmount: 0,
    dueDate: '2026-08-15',
    status: 'pending',
  },
];

const initialGrades: GradeRecord[] = [
  {
    id: 'grade-001',
    studentId: 'student-001',
    semester: 'Semester 5',
    subject: 'Data Structures',
    internalMarks: 45,
    externalMarks: 80,
    totalMarks: 125,
    grade: 'A+',
    credits: 4,
  },
  {
    id: 'grade-002',
    studentId: 'student-001',
    semester: 'Semester 5',
    subject: 'Database Management',
    internalMarks: 42,
    externalMarks: 75,
    totalMarks: 117,
    grade: 'A',
    credits: 4,
  },
  {
    id: 'grade-003',
    studentId: 'student-001',
    semester: 'Semester 5',
    subject: 'Operating Systems',
    internalMarks: 48,
    externalMarks: 85,
    totalMarks: 133,
    grade: 'A+',
    credits: 4,
  },
  {
    id: 'grade-004',
    studentId: 'student-001',
    semester: 'Semester 5',
    subject: 'Computer Networks',
    internalMarks: 40,
    externalMarks: 72,
    totalMarks: 112,
    grade: 'A',
    credits: 3,
  },
  {
    id: 'grade-005',
    studentId: 'student-001',
    semester: 'Semester 5',
    subject: 'Web Technologies',
    internalMarks: 47,
    externalMarks: 82,
    totalMarks: 129,
    grade: 'A+',
    credits: 3,
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'student-001',
    title: 'Leave Approved',
    message: 'Your sick leave application for Feb 10-12 has been approved by Dr. Ramesh Kumar.',
    type: 'leave',
    read: false,
    timestamp: '2026-02-04T10:30:00',
  },
  {
    id: 'notif-002',
    userId: 'student-001',
    title: 'New Announcement',
    message: 'Mid-Semester Examinations Schedule Released - Check announcements for details.',
    type: 'announcement',
    read: false,
    timestamp: '2026-02-01T14:00:00',
  },
  {
    id: 'notif-003',
    userId: 'student-001',
    title: 'Event Registration Confirmed',
    message: 'You have successfully registered for Smart India Hackathon 2026.',
    type: 'event',
    read: true,
    timestamp: '2026-01-20T16:45:00',
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [leaves, setLeaves] = useState<LeaveApplication[]>(initialLeaves);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [resources, setResources] = useState<StudyResource[]>(initialResources);
  const [attendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [timetable] = useState<TimeTableEntry[]>(initialTimetable);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [fees] = useState<FeeRecord[]>(initialFees);
  const [grades] = useState<GradeRecord[]>(initialGrades);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [blockchain] = useState<BlockchainLedger>(() => {
    const ledger = new BlockchainLedger();
    
    // Add initial records to blockchain
    ledger.addRecord(
      'leave',
      'Leave Approved',
      'student-001',
      'Thirumalai.C',
      {
        leaveId: 'leave-001',
        type: 'sick',
        fromDate: '2026-02-10',
        toDate: '2026-02-12',
        approvedBy: 'Dr. Ramesh Kumar',
      }
    );

    ledger.addRecord(
      'event',
      'Event Registration',
      'student-001',
      'Thirumalai.C',
      {
        eventId: 'event-001',
        eventName: 'Smart India Hackathon 2026',
        registrationDate: '2026-01-20',
      }
    );

    ledger.addRecord(
      'resource',
      'Resource Uploaded',
      'student-001',
      'Thirumalai.C',
      {
        resourceId: 'resource-001',
        title: 'Data Structures Complete Notes',
        subject: 'Data Structures',
      }
    );

    return ledger;
  });

  const applyLeave = (leave: Omit<LeaveApplication, 'id' | 'appliedDate' | 'status'>) => {
    const newLeave: LeaveApplication = {
      ...leave,
      id: `leave-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setLeaves([...leaves, newLeave]);

    // Add to blockchain
    blockchain.addRecord(
      'leave',
      'Leave Applied',
      leave.studentId,
      leave.studentName,
      {
        leaveId: newLeave.id,
        type: leave.leaveType,
        fromDate: leave.fromDate,
        toDate: leave.toDate,
      }
    );
  };

  const reviewLeave = (leaveId: string, status: 'approved' | 'rejected', reviewedBy: string, comments?: string) => {
    setLeaves(leaves.map(leave => {
      if (leave.id === leaveId) {
        const updatedLeave = {
          ...leave,
          status,
          reviewedBy,
          reviewedDate: new Date().toISOString().split('T')[0],
          comments,
        };

        // Add to blockchain
        blockchain.addRecord(
          'leave',
          status === 'approved' ? 'Leave Approved' : 'Leave Rejected',
          leave.studentId,
          leave.studentName,
          {
            leaveId,
            type: leave.leaveType,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reviewedBy,
            status,
          }
        );

        return updatedLeave;
      }
      return leave;
    }));
  };

  const registerForEvent = (eventId: string, studentId: string, studentName: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && !event.registrations.includes(studentId)) {
        // Add to blockchain
        blockchain.addRecord(
          'event',
          'Event Registration',
          studentId,
          studentName,
          {
            eventId,
            eventName: event.title,
            eventType: event.type,
            eventDate: event.date,
          }
        );

        return {
          ...event,
          registered: event.registered + 1,
          registrations: [...event.registrations, studentId],
        };
      }
      return event;
    }));
  };

  const uploadResource = (resource: Omit<StudyResource, 'id' | 'uploadDate' | 'downloads'>) => {
    const newResource: StudyResource = {
      ...resource,
      id: `resource-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
    };
    setResources([...resources, newResource]);

    // Add to blockchain
    blockchain.addRecord(
      'resource',
      'Resource Uploaded',
      resource.uploadedById,
      resource.uploadedBy,
      {
        resourceId: newResource.id,
        title: resource.title,
        subject: resource.subject,
        type: resource.type,
      }
    );
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'postedDate'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: `ach-${Date.now()}`,
    };
    setAchievements([...achievements, newAchievement]);

    // Add to blockchain
    blockchain.addRecord(
      'resource',
      'Achievement Added',
      achievement.studentId,
      achievement.studentName,
      {
        achievementId: newAchievement.id,
        title: achievement.title,
        category: achievement.category,
      }
    );
  };

  return (
    <DataContext.Provider
      value={{
        leaves,
        events,
        resources,
        attendance,
        timetable,
        announcements,
        achievements,
        fees,
        grades,
        notifications,
        blockchain,
        applyLeave,
        reviewLeave,
        registerForEvent,
        uploadResource,
        addAnnouncement,
        markNotificationRead,
        addAchievement,
      }}
    >
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