const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const { username, message } = JSON.parse(event.body || '{}');
      if (!username || !message) {
        return { statusCode: 400, body: 'Bad request: username and message required' };
      }

      const { error } = await supabase
        .from('messages')
        .insert([{ username, message }]);

      if (error) {
        console.error('Supabase insert error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, details: error.details || null }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Message sent' }),
      };
    }

    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase select error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, details: error.details || null }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    console.error('Unhandled error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unhandled error', message: err.message }),
    };
  }
};
