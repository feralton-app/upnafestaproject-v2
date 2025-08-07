#!/usr/bin/env python3
"""
Additional Backend Test - Test album creation with approved client
"""

import requests
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
import mysql.connector

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

def test_approved_client_album_creation():
    """Test album creation with an approved client"""
    session = requests.Session()
    
    print("🧪 Testing Album Creation with Approved Client")
    print("=" * 50)
    
    # Create a new client
    test_client = {
        "name": "Maria Oliveira",
        "email": f"maria.oliveira.{uuid.uuid4().hex[:8]}@email.com",
        "album_limit": 1
    }
    
    response = session.post(f"{API_BASE}/admin/clients", json=test_client)
    if response.status_code != 200:
        print(f"❌ Failed to create client: {response.status_code}")
        return
    
    client = response.json()
    client_id = client.get('id')
    print(f"✅ Created client: {client.get('name')} (ID: {client_id})")
    
    # Manually approve the client in the database
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='password',
            database='upnafesta'
        )
        cursor = conn.cursor()
        
        # Update client status to approved
        cursor.execute(
            "UPDATE clients SET status = 'approved', payment_status = 'confirmed', approval_date = %s WHERE id = %s",
            (datetime.utcnow(), client_id)
        )
        conn.commit()
        print("✅ Client approved in database")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Failed to approve client: {str(e)}")
        return
    
    # Now try to create an album
    test_album = {
        "name": "Aniversário Maria",
        "event_date": "2024-08-15T20:00:00"
    }
    
    response = session.post(f"{API_BASE}/clients/{client_id}/albums", json=test_album)
    if response.status_code == 200:
        album = response.json()
        print(f"✅ Successfully created album: {album.get('name')} (ID: {album.get('id')})")
        
        # Test album update
        album_update = {
            "event_date": "2024-08-20T19:30:00",
            "primary_color": "#FF6B6B",
            "welcome_message": "Bem-vindos à festa da Maria!"
        }
        
        response = session.put(f"{API_BASE}/clients/{client_id}/albums/{album.get('id')}", json=album_update)
        if response.status_code == 200:
            updated_album = response.json()
            print(f"✅ Successfully updated album - new event date: {updated_album.get('event_date')}")
            print(f"✅ Album customization - color: {updated_album.get('primary_color')}")
        else:
            print(f"❌ Failed to update album: {response.status_code}")
        
        # Test getting albums for the client
        response = session.get(f"{API_BASE}/clients/{client_id}/albums")
        if response.status_code == 200:
            albums = response.json()
            print(f"✅ Retrieved {len(albums)} albums for approved client")
        else:
            print(f"❌ Failed to get client albums: {response.status_code}")
            
    else:
        print(f"❌ Failed to create album for approved client: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_approved_client_album_creation()