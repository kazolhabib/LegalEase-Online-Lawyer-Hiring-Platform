const API_URL = 'http://localhost:5001/api';

async function check() {
  try {
    // 1. Get all lawyers
    const res = await fetch(`${API_URL}/lawyers`);
    const data = await res.json();
    console.log('Lawyers list response status:', res.status);
    console.log('Total lawyers returned:', data.lawyers ? data.lawyers.length : 0);
    
    if (data.lawyers && data.lawyers.length > 0) {
      const firstLawyer = data.lawyers[0];
      console.log('First Lawyer name:', firstLawyer.user?.name);
      console.log('First Lawyer ID:', firstLawyer._id);
      
      // 2. Fetch by ID
      const resDetail = await fetch(`${API_URL}/lawyers/${firstLawyer._id}`);
      const dataDetail = await resDetail.json();
      console.log('Detail response status for ID:', resDetail.status);
      console.log('Detail data:', dataDetail);
    }
  } catch (err) {
    console.error('Error during API check:', err);
  }
}

check();
