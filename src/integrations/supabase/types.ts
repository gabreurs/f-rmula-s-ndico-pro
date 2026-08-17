export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      contact_interactions: {
        Row: {
          contact_id: string
          created_at: string
          descricao: string | null
          event_id: string | null
          id: string
          source: string | null
          tipo: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          descricao?: string | null
          event_id?: string | null
          id?: string
          source?: string | null
          tipo: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          descricao?: string | null
          event_id?: string | null
          id?: string
          source?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          administradora: string | null
          cargo: string | null
          cidade: string | null
          consentimento: boolean
          created_at: string
          email: string | null
          email_norm: string | null
          id: string
          interesses: string[]
          nome: string
          observacoes: string | null
          perfis: string[]
          qtd_condominios: number | null
          source: string
          source_detail: string | null
          tags: string[]
          tipo_sindico: string | null
          uf: string | null
          ultima_interacao_em: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string | null
          whatsapp_norm: string | null
        }
        Insert: {
          administradora?: string | null
          cargo?: string | null
          cidade?: string | null
          consentimento?: boolean
          created_at?: string
          email?: string | null
          email_norm?: string | null
          id?: string
          interesses?: string[]
          nome: string
          observacoes?: string | null
          perfis?: string[]
          qtd_condominios?: number | null
          source?: string
          source_detail?: string | null
          tags?: string[]
          tipo_sindico?: string | null
          uf?: string | null
          ultima_interacao_em?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
          whatsapp_norm?: string | null
        }
        Update: {
          administradora?: string | null
          cargo?: string | null
          cidade?: string | null
          consentimento?: boolean
          created_at?: string
          email?: string | null
          email_norm?: string | null
          id?: string
          interesses?: string[]
          nome?: string
          observacoes?: string | null
          perfis?: string[]
          qtd_condominios?: number | null
          source?: string
          source_detail?: string | null
          tags?: string[]
          tipo_sindico?: string | null
          uf?: string | null
          ultima_interacao_em?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
          whatsapp_norm?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          contact_id: string
          created_at: string
          event_id: string
          id: string
          observacoes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          event_id: string
          id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          event_id?: string
          id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cidade: string | null
          created_at: string
          data: string | null
          horario: string | null
          id: string
          local: string | null
          modalidade: string
          nome: string
          observacoes: string | null
          partner_id: string | null
          plataforma_inscricao: string | null
          slug: string
          status: string
          tipo: string
          uf: string | null
          updated_at: string
          url_inscricao: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          data?: string | null
          horario?: string | null
          id?: string
          local?: string | null
          modalidade?: string
          nome: string
          observacoes?: string | null
          partner_id?: string | null
          plataforma_inscricao?: string | null
          slug: string
          status?: string
          tipo?: string
          uf?: string | null
          updated_at?: string
          url_inscricao?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          data?: string | null
          horario?: string | null
          id?: string
          local?: string | null
          modalidade?: string
          nome?: string
          observacoes?: string | null
          partner_id?: string | null
          plataforma_inscricao?: string | null
          slug?: string
          status?: string
          tipo?: string
          uf?: string | null
          updated_at?: string
          url_inscricao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      imports: {
        Row: {
          arquivo: string | null
          atualizados: number
          created_at: string
          erros: number
          event_id: string | null
          id: string
          ignorados: number
          novos: number
          relatorio: Json | null
          source: string
          source_detail: string | null
          total: number
        }
        Insert: {
          arquivo?: string | null
          atualizados?: number
          created_at?: string
          erros?: number
          event_id?: string | null
          id?: string
          ignorados?: number
          novos?: number
          relatorio?: Json | null
          source?: string
          source_detail?: string | null
          total?: number
        }
        Update: {
          arquivo?: string | null
          atualizados?: number
          created_at?: string
          erros?: number
          event_id?: string | null
          id?: string
          ignorados?: number
          novos?: number
          relatorio?: Json | null
          source?: string
          source_detail?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "imports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          administradora: string
          cargo: string | null
          cidade: string
          created_at: string
          data_confirmacao_formato: string | null
          email: string | null
          estrutura_presencial: string | null
          formato_preferido: string | null
          id: string
          intencao_90_dias: string | null
          nome_responsavel: string
          objetivo_principal: string | null
          observacoes_internas: string | null
          observacoes_lead: string | null
          origem: string
          origem_atribuida: string
          participa_decisao: string | null
          periodo_desejado: string | null
          proximo_followup: string | null
          qtd_condominios: number | null
          qtd_sindicos: number | null
          responsavel_followup: string | null
          responsavel_interno: string | null
          status: string
          status_atualizado_em: string
          uf: string
          whatsapp: string
        }
        Insert: {
          administradora: string
          cargo?: string | null
          cidade: string
          created_at?: string
          data_confirmacao_formato?: string | null
          email?: string | null
          estrutura_presencial?: string | null
          formato_preferido?: string | null
          id?: string
          intencao_90_dias?: string | null
          nome_responsavel: string
          objetivo_principal?: string | null
          observacoes_internas?: string | null
          observacoes_lead?: string | null
          origem?: string
          origem_atribuida?: string
          participa_decisao?: string | null
          periodo_desejado?: string | null
          proximo_followup?: string | null
          qtd_condominios?: number | null
          qtd_sindicos?: number | null
          responsavel_followup?: string | null
          responsavel_interno?: string | null
          status?: string
          status_atualizado_em?: string
          uf: string
          whatsapp: string
        }
        Update: {
          administradora?: string
          cargo?: string | null
          cidade?: string
          created_at?: string
          data_confirmacao_formato?: string | null
          email?: string | null
          estrutura_presencial?: string | null
          formato_preferido?: string | null
          id?: string
          intencao_90_dias?: string | null
          nome_responsavel?: string
          objetivo_principal?: string | null
          observacoes_internas?: string | null
          observacoes_lead?: string | null
          origem?: string
          origem_atribuida?: string
          participa_decisao?: string | null
          periodo_desejado?: string | null
          proximo_followup?: string | null
          qtd_condominios?: number | null
          qtd_sindicos?: number | null
          responsavel_followup?: string | null
          responsavel_interno?: string | null
          status?: string
          status_atualizado_em?: string
          uf?: string
          whatsapp?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          cidade: string | null
          created_at: string
          email: string | null
          empresa: string
          id: string
          observacoes: string | null
          responsavel: string | null
          segmento: string | null
          telefone: string | null
          tipo_parceria: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          empresa: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          segmento?: string | null
          telefone?: string | null
          tipo_parceria?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          email?: string | null
          empresa?: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          segmento?: string | null
          telefone?: string | null
          tipo_parceria?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
