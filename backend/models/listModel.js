import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  agentName: {
    type: String, 
    required: true
  },
  items: [
    {
      FirstName: {
        type: String,
        required: true
      },
      Phone: {
        type: String,
        required: true
      },
      Notes: {
        type: String,
        default: ''
      }
    }
  ],
  assignedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const listModel =  mongoose.models.list || mongoose.model('list', ListSchema);

export  default listModel;