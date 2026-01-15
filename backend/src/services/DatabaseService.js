const { createClient } = require('@supabase/supabase-js');

/**
 * Database Service - Supabase ONLY
 * 
 * This service uses Supabase as the ONLY database.
 * No JSON fallback - Supabase is required.
 */
class DatabaseService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    // Log what we found (without exposing values)
    console.log('🔍 DatabaseService initialization:');
    console.log('  SUPABASE_URL:', supabaseUrl ? `✓ Set (${supabaseUrl.substring(0, 30)}...)` : '✗ Missing');
    console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing');
    console.log('  SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
    console.log('  Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : (process.env.SUPABASE_ANON_KEY ? 'ANON' : 'NONE'));
    
    if (!supabaseUrl || !supabaseKey) {
      const missing = [];
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
      throw new Error(`❌ Supabase credentials are required! Missing: ${missing.join(', ')}. Please set these environment variables in Vercel project settings.`);
    }
    
    // Check which key is being used
    const isServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (isServiceRole) {
      console.log('✅ Connected to Supabase database using SERVICE ROLE KEY (bypasses RLS)');
    } else {
      console.warn('⚠️  Using ANON KEY - RLS policies will apply. Consider using SERVICE ROLE KEY for admin operations.');
    }
    
    try {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client created successfully');
    } catch (clientError) {
      console.error('❌ Error creating Supabase client:', clientError);
      throw new Error(`Failed to create Supabase client: ${clientError.message}`);
    }
  }

  // ==================== USERS ====================
  
  async getUsers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
    return data || [];
  }

  async saveUsers(users) {
    // For bulk operations, use upsert
    const { error } = await this.supabase
      .from('users')
      .upsert(users, { onConflict: 'id' });
    
    if (error) {
      console.error('❌ Error saving users:', error);
      throw error;
    }
  }

  async createUser(user) {
    // Use upsert to handle both insert and update (prevents duplicate key errors)
    const { data, error } = await this.supabase
      .from('users')
      .upsert(user, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating/updating user:', error);
      throw error;
    }
    return data;
  }

  async updateUser(userId, updates) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
    return data;
  }

  async deleteUser(userId) {
    console.log('🗑️  Attempting to delete user from Supabase:', userId);
    
    // First check if user exists
    const { data: existingUser, error: checkError } = await this.supabase
      .from('users')
      .select('id, email, name')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw new Error('User not found');
      }
      console.error('❌ Error checking user existence:', checkError);
      throw checkError;
    }
    
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    console.log('✅ User found, proceeding with deletion:', existingUser.email);
    
    // Delete the user
    const { data: deletedData, error: deleteError } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId)
      .select();
    
    if (deleteError) {
      console.error('❌ Error deleting user from Supabase:', deleteError);
      
      if (deleteError.message && deleteError.message.includes('policy')) {
        throw new Error('Deletion blocked by Row Level Security policy. Please check Supabase RLS settings.');
      }
      
      throw deleteError;
    }
    
    // Verify deletion was successful
    if (!deletedData || deletedData.length === 0) {
      console.warn('⚠️  Delete query returned no data - checking if user still exists...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: verifyUser, error: verifyError } = await this.supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (verifyUser) {
        throw new Error('User deletion failed - user still exists in database. This may be due to RLS policies or foreign key constraints.');
      } else {
        console.log('✅ User successfully deleted (verified)');
      }
    } else {
      console.log('✅ User successfully deleted from Supabase:', existingUser.email);
    }
    
    return { success: true, deletedId: userId, deletedUser: existingUser };
  }

  // ==================== ANIMALS ====================
  
  async getAnimals() {
    console.log('📖 DatabaseService: Fetching animals from Supabase...');
    const { data, error } = await this.supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ DatabaseService: Error fetching animals:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      throw error;
    }
    
    console.log(`✅ DatabaseService: Fetched ${data?.length || 0} animals from Supabase`);
    if (data && data.length > 0) {
      console.log('📋 Sample animal IDs:', data.slice(0, 3).map(a => a.id).join(', '));
    }
    return data || [];
  }

  async saveAnimals(animals) {
    // For bulk operations, use upsert
    const { error } = await this.supabase
      .from('animals')
      .upsert(animals, { onConflict: 'id' });
    
    if (error) {
      console.error('❌ Error saving animals:', error);
      throw error;
    }
  }

  async createAnimal(animal) {
    console.log('📝 DatabaseService: Creating animal in Supabase:', animal.id);
    console.log('📝 Animal data:', JSON.stringify(animal, null, 2));
    
    const { data, error } = await this.supabase
      .from('animals')
      .insert(animal)
      .select()
      .single();
    
    if (error) {
      console.error('❌ DatabaseService: Error creating animal:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error details:', error.details);
      console.error('❌ Error hint:', error.hint);
      throw error;
    }
    
    console.log('✅ DatabaseService: Animal created successfully:', data.id);
    return data;
  }

  async updateAnimal(animalId, updates) {
    const { data, error } = await this.supabase
      .from('animals')
      .update(updates)
      .eq('id', animalId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating animal:', error);
      throw error;
    }
    return data;
  }

  async deleteAnimal(animalId) {
    const { error } = await this.supabase
      .from('animals')
      .delete()
      .eq('id', animalId);
    
    if (error) {
      console.error('❌ Error deleting animal:', error);
      throw error;
    }
    return true;
  }

  // ==================== LOGS ====================
  
  async getLogs() {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching logs:', error);
      throw error;
    }
    return data || [];
  }

  async saveLogs(logs) {
    // For logs, we typically append rather than replace
    const newLogs = logs.filter(log => !log.id || !log.saved);
    if (newLogs.length > 0) {
      const { error } = await this.supabase
        .from('activity_logs')
        .insert(newLogs);
      
      if (error) {
        console.error('❌ Error saving logs:', error);
        throw error;
      }
    }
  }

  async createLog(log) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating log:', error);
      throw error;
    }
    return data;
  }

  // ==================== BREEDS ====================
  
  async getBreeds() {
    const { data, error } = await this.supabase
      .from('breeds')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching breeds:', error);
      throw error;
    }
    return data || [];
  }

  async saveBreeds(breeds) {
    // Use upsert to handle both insert and update
    const { error } = await this.supabase
      .from('breeds')
      .upsert(breeds, { onConflict: 'id' });
    
    if (error) {
      console.error('❌ Error saving breeds:', error);
      throw error;
    }
  }

  async createBreed(breed) {
    const { data, error } = await this.supabase
      .from('breeds')
      .insert(breed)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating breed:', error);
      throw error;
    }
    return data;
  }

  async updateBreed(breedId, updates) {
    const { data, error } = await this.supabase
      .from('breeds')
      .update(updates)
      .eq('id', breedId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating breed:', error);
      throw error;
    }
    return data;
  }

  async deleteBreed(breedId) {
    console.log('🗑️  Attempting to delete breed from Supabase:', breedId);
    
    // First check if breed exists
    const { data: existingBreed, error: checkError } = await this.supabase
      .from('breeds')
      .select('id, name')
      .eq('id', breedId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw new Error('Breed not found');
      }
      console.error('❌ Error checking breed existence:', checkError);
      throw checkError;
    }
    
    if (!existingBreed) {
      throw new Error('Breed not found');
    }
    
    console.log('✅ Breed found, proceeding with deletion:', existingBreed.name);
    
    // Delete the breed
    const { data: deletedData, error: deleteError } = await this.supabase
      .from('breeds')
      .delete()
      .eq('id', breedId)
      .select();
    
    if (deleteError) {
      console.error('❌ Error deleting breed from Supabase:', deleteError);
      
      if (deleteError.message && deleteError.message.includes('policy')) {
        throw new Error('Deletion blocked by Row Level Security policy. Please check Supabase RLS settings.');
      }
      
      throw deleteError;
    }
    
    // Verify deletion was successful
    if (!deletedData || deletedData.length === 0) {
      console.warn('⚠️  Delete query returned no data - checking if breed still exists...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: verifyBreed, error: verifyError } = await this.supabase
        .from('breeds')
        .select('id')
        .eq('id', breedId)
        .maybeSingle();
      
      if (verifyBreed) {
        throw new Error('Breed deletion failed - breed still exists in database. This may be due to RLS policies.');
      } else {
        console.log('✅ Breed successfully deleted (verified)');
      }
    } else {
      console.log('✅ Breed successfully deleted from Supabase:', existingBreed.name);
    }
    
    return { success: true, deletedId: breedId, deletedBreed: existingBreed };
  }
}

module.exports = DatabaseService;
